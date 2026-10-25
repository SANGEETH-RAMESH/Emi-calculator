export type InterestMethod = 'reducing' | 'flat';

export interface EmiInputs {
  bikePrice: number;
  downPayment: number;
  interestRate: number; // Annual rate in percentage (e.g. 6.5)
  tenureYears: number;  // 1, 2, 3, 4, 5
  interestMethod: InterestMethod;
  additionalCharges: number;
}

export interface EmiResult {
  monthlyEmi: number;
  loanAmount: number; // Principal
  totalInterest: number;
  totalRepayment: number;
  downPayment: number;
  additionalCharges: number;
  totalCost: number;
  interestRate: number;
  tenureYears: number;
  totalMonths: number;
  interestMethod: InterestMethod;
  principalPercentage: number;
  interestPercentage: number;
}

export interface ValidationErrors {
  bikePrice?: string;
  downPayment?: string;
  interestRate?: string;
  tenureYears?: string;
  additionalCharges?: string;
}
