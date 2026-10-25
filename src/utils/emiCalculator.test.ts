import { describe, it, expect } from 'vitest';
import {
  calculateEmi,
  formatIndianCurrency,
  formatIndianNumber,
  parseCurrencyInput,
  validateInputs,
  DEFAULT_EMI_INPUTS,
} from './emiCalculator';
import type { EmiInputs } from '../types/emi';

describe('EMI Calculator Core Tests', () => {
  const baseTestInput: EmiInputs = {
    bikePrice: 309000,
    downPayment: 61000,
    interestRate: 6.5,
    tenureYears: 3,
    interestMethod: 'reducing',
    additionalCharges: 0,
  };

  describe('Section 8 Test Cases (Reducing Balance)', () => {
    it('calculates 3-year Reducing Balance accurately (EMI ~ ₹7,601)', () => {
      const res = calculateEmi(baseTestInput);

      expect(res.loanAmount).toBe(248000);
      expect(res.monthlyEmi).toBe(7601);
      expect(res.totalRepayment).toBe(273634);
      expect(res.totalInterest).toBe(25634);
      expect(res.totalCost).toBe(334634);
      expect(res.principalPercentage).toBe(90.7);
      expect(res.interestPercentage).toBe(9.3);
    });

    it('calculates 4-year Reducing Balance accurately (EMI ~ ₹5,881)', () => {
      const res = calculateEmi({
        ...baseTestInput,
        tenureYears: 4,
      });

      expect(res.loanAmount).toBe(248000);
      expect(res.monthlyEmi).toBe(5881);
      expect(res.totalMonths).toBe(48);
    });
  });

  describe('Section 8 Test Cases (Flat Rate)', () => {
    it('calculates 3-year Flat Rate accurately (EMI ~ ₹8,232)', () => {
      const res = calculateEmi({
        ...baseTestInput,
        interestMethod: 'flat',
        tenureYears: 3,
      });

      expect(res.loanAmount).toBe(248000);
      expect(res.monthlyEmi).toBe(8232);
      expect(res.totalInterest).toBe(48360);
      expect(res.totalRepayment).toBe(296360);
      expect(res.totalCost).toBe(357360);
    });

    it('calculates 4-year Flat Rate accurately (EMI ~ ₹6,510)', () => {
      const res = calculateEmi({
        ...baseTestInput,
        interestMethod: 'flat',
        tenureYears: 4,
      });

      expect(res.loanAmount).toBe(248000);
      expect(res.monthlyEmi).toBe(6510);
      expect(res.totalInterest).toBe(64480);
      expect(res.totalRepayment).toBe(312480);
      expect(res.totalCost).toBe(373480);
    });
  });

  describe('All Tenures (1 to 5 Years)', () => {
    it('calculates valid results for all supported tenures', () => {
      [1, 2, 3, 4, 5].forEach((tenure) => {
        const reducingRes = calculateEmi({ ...baseTestInput, tenureYears: tenure });
        expect(reducingRes.monthlyEmi).toBeGreaterThan(0);
        expect(reducingRes.totalMonths).toBe(tenure * 12);
        expect(reducingRes.totalRepayment).toBeGreaterThanOrEqual(reducingRes.loanAmount);

        const flatRes = calculateEmi({ ...baseTestInput, interestMethod: 'flat', tenureYears: tenure });
        expect(flatRes.monthlyEmi).toBeGreaterThan(0);
        expect(flatRes.totalMonths).toBe(tenure * 12);
        expect(flatRes.totalRepayment).toBeGreaterThanOrEqual(flatRes.loanAmount);
      });
    });
  });

  describe('Additional Charges Handling', () => {
    it('correctly includes additional charges in total cost without altering principal or interest', () => {
      const res = calculateEmi({
        ...baseTestInput,
        additionalCharges: 5000,
      });

      expect(res.loanAmount).toBe(248000);
      expect(res.totalInterest).toBe(25634);
      expect(res.totalRepayment).toBe(273634);
      expect(res.additionalCharges).toBe(5000);
      expect(res.totalCost).toBe(334634 + 5000);
    });
  });

  describe('Edge Cases', () => {
    it('handles 0% interest rate gracefully', () => {
      const res = calculateEmi({
        ...baseTestInput,
        interestRate: 0,
        tenureYears: 2,
      });

      expect(res.loanAmount).toBe(248000);
      expect(res.monthlyEmi).toBe(Math.round(248000 / 24));
      expect(res.totalInterest).toBe(0);
      expect(res.totalRepayment).toBe(248000);
    });

    it('handles 100% down payment (loan amount 0)', () => {
      const res = calculateEmi({
        ...baseTestInput,
        downPayment: baseTestInput.bikePrice,
      });

      expect(res.loanAmount).toBe(0);
      expect(res.monthlyEmi).toBe(0);
      expect(res.totalInterest).toBe(0);
      expect(res.totalRepayment).toBe(0);
      expect(res.totalCost).toBe(baseTestInput.bikePrice);
    });
  });

  describe('Currency and Number Formatting', () => {
    it('formats Indian currency properly with ₹ symbol', () => {
      expect(formatIndianCurrency(309000)).toBe('₹ 3,09,000');
      expect(formatIndianCurrency(248000)).toBe('₹ 2,48,000');
      expect(formatIndianCurrency(7601)).toBe('₹ 7,601');
      expect(formatIndianCurrency(0)).toBe('₹ 0');
    });

    it('formats numbers in Indian style without currency symbol', () => {
      expect(formatIndianNumber(309000)).toBe('3,09,000');
      expect(formatIndianNumber(61000)).toBe('61,000');
    });

    it('parses formatted numeric strings into clean numbers', () => {
      expect(parseCurrencyInput('₹ 3,09,000')).toBe(309000);
      expect(parseCurrencyInput('61,000')).toBe(61000);
      expect(parseCurrencyInput('abc')).toBe(0);
    });
  });

  describe('Validation Logic', () => {
    it('validates filled inputs as valid', () => {
      const { isValid, errors } = validateInputs(baseTestInput);
      expect(isValid).toBe(true);
      expect(Object.keys(errors).length).toBe(0);
    });

    it('requires vehicle price when starting empty', () => {
      const { isValid, errors } = validateInputs(DEFAULT_EMI_INPUTS);
      expect(isValid).toBe(false);
      expect(errors.bikePrice).toBe('Please enter your vehicle price');
    });

    it('flags down payment greater than bike price', () => {
      const { isValid, errors } = validateInputs({
        ...DEFAULT_EMI_INPUTS,
        bikePrice: 100000,
        downPayment: 150000,
      });
      expect(isValid).toBe(false);
      expect(errors.downPayment).toBe('Down payment cannot exceed the vehicle price');
    });

    it('flags negative bike price or below minimum', () => {
      const { isValid, errors } = validateInputs({
        ...DEFAULT_EMI_INPUTS,
        bikePrice: 5000,
      });
      expect(isValid).toBe(false);
      expect(errors.bikePrice).toBe('Minimum vehicle price is ₹ 10,000');
    });
  });
});
