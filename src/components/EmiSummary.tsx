import React from 'react';
import { Coins, Percent, Wallet, TrendingUp } from 'lucide-react';
import type { EmiResult } from '../types/emi';
import { formatIndianCurrency } from '../utils/emiCalculator';

interface EmiSummaryProps {
  result: EmiResult;
}

export const EmiSummary: React.FC<EmiSummaryProps> = ({ result }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Loan Amount */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-5 shadow-xs hover:shadow-sm transition">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Coins className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-semibold text-gray-500 block truncate">
              Loan Amount
            </span>
            <span className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight block">
              {formatIndianCurrency(result.loanAmount)}
            </span>
          </div>
        </div>
        <p className="text-[11px] text-gray-400 mt-2.5 font-medium truncate">
          (Price - Down Payment)
        </p>
      </div>

      {/* 2. Total Interest */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-5 shadow-xs hover:shadow-sm transition">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <Percent className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-semibold text-gray-500 block truncate">
              Total Interest
            </span>
            <span className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight block">
              {formatIndianCurrency(result.totalInterest)}
            </span>
          </div>
        </div>
        <p className="text-[11px] text-gray-400 mt-2.5 font-medium truncate">
          at {result.interestRate}% p.a.
        </p>
      </div>

      {/* 3. Total Repayment */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-5 shadow-xs hover:shadow-sm transition">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
            <Wallet className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-semibold text-gray-500 block truncate">
              Total Repayment
            </span>
            <span className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight block">
              {formatIndianCurrency(result.totalRepayment)}
            </span>
          </div>
        </div>
        <p className="text-[11px] text-gray-400 mt-2.5 font-medium truncate">
          (Principal + Interest)
        </p>
      </div>

      {/* 4. Total Cost */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-5 shadow-xs hover:shadow-sm transition">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-semibold text-gray-500 block truncate">
              Total Cost
            </span>
            <span className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight block">
              {formatIndianCurrency(result.totalCost)}
            </span>
          </div>
        </div>
        <p className="text-[11px] text-gray-400 mt-2.5 font-medium truncate">
          (Including Down Payment)
        </p>
      </div>
    </div>
  );
};
