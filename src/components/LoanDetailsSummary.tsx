import React from 'react';
import { Edit2 } from 'lucide-react';
import type { EmiInputs } from '../types/emi';
import { formatIndianCurrency } from '../utils/emiCalculator';

interface LoanDetailsSummaryProps {
  inputs: EmiInputs;
  onEdit: () => void;
}

export const LoanDetailsSummary: React.FC<LoanDetailsSummaryProps> = ({ inputs, onEdit }) => {
  const loanAmount = Math.max(0, inputs.bikePrice - inputs.downPayment);

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <h3 className="text-base font-bold text-gray-900 tracking-tight">
          Your Loan Details
        </h3>
        <button
          type="button"
          id="btn-edit-details"
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-[#1e5631] bg-emerald-50 hover:bg-emerald-100/80 transition"
        >
          <Edit2 className="w-3.5 h-3.5" />
          <span>Edit</span>
        </button>
      </div>

      {/* Details List */}
      <div className="divide-y divide-gray-100 text-xs sm:text-sm">
        <div className="py-2.5 flex items-center justify-between">
          <span className="text-gray-500">Bike Price (On-road)</span>
          <span className="font-bold text-gray-900">
            {formatIndianCurrency(inputs.bikePrice)}
          </span>
        </div>

        <div className="py-2.5 flex items-center justify-between">
          <span className="text-gray-500">Down Payment</span>
          <span className="font-bold text-gray-900">
            {formatIndianCurrency(inputs.downPayment)}
          </span>
        </div>

        <div className="py-2.5 flex items-center justify-between">
          <span className="text-gray-500">Loan Amount</span>
          <span className="font-bold text-emerald-800">
            {formatIndianCurrency(loanAmount)}
          </span>
        </div>

        <div className="py-2.5 flex items-center justify-between">
          <span className="text-gray-500">Annual Interest Rate</span>
          <span className="font-bold text-gray-900">
            {inputs.interestRate}%
          </span>
        </div>

        <div className="py-2.5 flex items-center justify-between">
          <span className="text-gray-500">Loan Tenure</span>
          <span className="font-bold text-gray-900">
            {inputs.tenureYears} {inputs.tenureYears === 1 ? 'Year' : 'Years'} ({inputs.tenureYears * 12} months)
          </span>
        </div>

        <div className="py-2.5 flex items-center justify-between">
          <span className="text-gray-500">Interest Method</span>
          <span className="font-bold text-gray-900">
            {inputs.interestMethod === 'reducing' ? 'Reducing Balance' : 'Flat Rate'}
          </span>
        </div>

        <div className="py-2.5 flex items-center justify-between">
          <span className="text-gray-500">Additional Charges</span>
          <span className="font-bold text-gray-900">
            {formatIndianCurrency(inputs.additionalCharges)}
          </span>
        </div>
      </div>
    </div>
  );
};
