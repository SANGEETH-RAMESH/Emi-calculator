import type { EmiInputs, EmiResult, ValidationErrors } from '../types/emi';

export const DEFAULT_EMI_INPUTS: EmiInputs = {
  bikePrice: 0,
  downPayment: 0,
  interestRate: 0,
  tenureYears: 3,
  interestMethod: 'reducing',
  additionalCharges: 0,
};

/**
 * Formats a number to Indian Rupee currency format (e.g. ₹ 3,09,000)
 */
export function formatIndianCurrency(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₹ 0';
  }
  const rounded = Math.round(amount);
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(Math.abs(rounded));

  return `${rounded < 0 ? '-' : ''}₹ ${formatted}`;
}

/**
 * Formats a number in Indian number system without currency symbol (e.g. 3,09,000)
 */
export function formatIndianNumber(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '0';
  }
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

/**
 * Parses user input string to clean numeric value
 */
export function parseCurrencyInput(value: string): number {
  const clean = value.replace(/[^0-9]/g, '');
  if (!clean) return 0;
  const num = parseInt(clean, 10);
  return isNaN(num) ? 0 : num;
}

/**
 * Validates loan input parameters
 */
export function validateInputs(inputs: EmiInputs): { isValid: boolean; errors: ValidationErrors } {
  const errors: ValidationErrors = {};

  if (!inputs.bikePrice || inputs.bikePrice <= 0) {
    errors.bikePrice = 'Please enter your vehicle price';
  } else if (inputs.bikePrice < 10000) {
    errors.bikePrice = 'Minimum vehicle price is ₹ 10,000';
  }

  if (inputs.downPayment < 0) {
    errors.downPayment = 'Down payment cannot be negative';
  } else if (inputs.bikePrice > 0 && inputs.downPayment > inputs.bikePrice) {
    errors.downPayment = 'Down payment cannot exceed the vehicle price';
  }

  if (inputs.interestRate === undefined || inputs.interestRate === null || inputs.interestRate <= 0) {
    errors.interestRate = 'Please enter an annual interest rate';
  } else if (inputs.interestRate > 50) {
    errors.interestRate = 'Interest rate cannot exceed 50%';
  }

  if (![1, 2, 3, 4, 5].includes(inputs.tenureYears)) {
    errors.tenureYears = 'Please select a tenure between 1 and 5 years';
  }

  if (inputs.additionalCharges < 0) {
    errors.additionalCharges = 'Additional charges cannot be negative';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Calculates complete EMI and loan repayment details
 */
export function calculateEmi(inputs: EmiInputs): EmiResult {
  const bikePrice = Math.max(0, inputs.bikePrice || 0);
  const downPayment = Math.max(0, Math.min(inputs.downPayment || 0, bikePrice));
  const principal = Math.max(0, bikePrice - downPayment);
  const annualRate = Math.max(0, inputs.interestRate || 0);
  const tenureYears = inputs.tenureYears || 1;
  const totalMonths = tenureYears * 12;
  const additionalCharges = Math.max(0, inputs.additionalCharges || 0);

  let monthlyEmi = 0;
  let totalRepayment = 0;
  let totalInterest = 0;

  if (principal === 0 || totalMonths === 0) {
    monthlyEmi = 0;
    totalRepayment = 0;
    totalInterest = 0;
  } else if (inputs.interestMethod === 'flat') {
    // Flat Rate Method:
    // Total Interest = P × (R / 100) × Tenure in Years
    // EMI = (P + Total Interest) / n
    // Total Repayment = EMI × n = P + Total Interest
    totalInterest = Math.round(principal * (annualRate / 100) * tenureYears);
    totalRepayment = principal + totalInterest;
    monthlyEmi = Math.round(totalRepayment / totalMonths);
  } else {
    // Reducing Balance Method:
    // P = Loan Amount, R = Annual Interest Rate, r = R / 12 / 100, n = totalMonths
    // EMI = P × r × (1 + r)^n / ((1 + r)^n − 1)
    if (annualRate === 0) {
      monthlyEmi = Math.round(principal / totalMonths);
      totalRepayment = principal;
      totalInterest = 0;
    } else {
      const monthlyRate = annualRate / 12 / 100;
      const factor = Math.pow(1 + monthlyRate, totalMonths);
      const rawEmi = (principal * monthlyRate * factor) / (factor - 1);
      
      monthlyEmi = Math.round(rawEmi);
      // Total Repayment = rawEmi * totalMonths, rounded to nearest rupee
      totalRepayment = Math.round(rawEmi * totalMonths);
      totalInterest = Math.max(0, totalRepayment - principal);
    }
  }

  // Total Cost = Down Payment + Total Repayment + Additional Charges
  const totalCost = downPayment + totalRepayment + additionalCharges;

  // Percentage calculations for breakdown chart
  let principalPercentage = 100;
  let interestPercentage = 0;
  if (totalRepayment > 0) {
    interestPercentage = Math.floor((totalInterest / totalRepayment) * 1000) / 10;
    principalPercentage = Number((100 - interestPercentage).toFixed(1));
  }

  return {
    monthlyEmi,
    loanAmount: principal,
    totalInterest,
    totalRepayment,
    downPayment,
    additionalCharges,
    totalCost,
    interestRate: annualRate,
    tenureYears,
    totalMonths,
    interestMethod: inputs.interestMethod,
    principalPercentage,
    interestPercentage,
  };
}
