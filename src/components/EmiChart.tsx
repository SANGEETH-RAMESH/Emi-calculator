import React, { useState } from 'react';
import { PieChart } from 'lucide-react';
import type { EmiResult } from '../types/emi';
import { formatIndianCurrency } from '../utils/emiCalculator';

interface EmiChartProps {
  result: EmiResult;
}

export const EmiChart: React.FC<EmiChartProps> = ({ result }) => {
  const [hoveredSlice, setHoveredSlice] = useState<'principal' | 'interest' | null>(null);

  const radius = 68;
  const strokeWidth = 26;
  const circumference = 2 * Math.PI * radius;

  // Safe percentage calculations
  const principalRatio = result.totalRepayment > 0 ? result.loanAmount / result.totalRepayment : 1;
  const principalStroke = circumference * principalRatio;
  const interestStroke = circumference * (1 - principalRatio);

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#1e5631] flex items-center justify-center flex-shrink-0">
            <PieChart className="w-4 h-4 stroke-[2]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 tracking-tight">
              Payment Breakdown
            </h3>
            <p className="text-xs text-gray-400">
              See how your total payment is split
            </p>
          </div>
        </div>

        {/* Donut Chart & Legend Container */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-6">
          {/* SVG Donut Chart */}
          <div className="relative w-44 h-44 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-full h-full transform -rotate-90 filter drop-shadow-xs"
              viewBox="0 0 180 180"
            >
              {/* Background ring */}
              <circle
                cx="90"
                cy="90"
                r={radius}
                className="stroke-gray-100"
                strokeWidth={strokeWidth}
                fill="transparent"
              />

              {/* Principal Segment (Green #1e824c / #16a34a) */}
              <circle
                cx="90"
                cy="90"
                r={radius}
                stroke="#16a34a"
                strokeWidth={hoveredSlice === 'principal' ? strokeWidth + 3 : strokeWidth}
                strokeDasharray={`${principalStroke} ${circumference}`}
                strokeDashoffset={0}
                fill="transparent"
                strokeLinecap="round"
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredSlice('principal')}
                onMouseLeave={() => setHoveredSlice(null)}
              />

              {/* Interest Segment (Amber #f59e0b) */}
              {result.totalInterest > 0 && (
                <circle
                  cx="90"
                  cy="90"
                  r={radius}
                  stroke="#f59e0b"
                  strokeWidth={hoveredSlice === 'interest' ? strokeWidth + 3 : strokeWidth}
                  strokeDasharray={`${interestStroke} ${circumference}`}
                  strokeDashoffset={-principalStroke}
                  fill="transparent"
                  strokeLinecap="round"
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredSlice('interest')}
                  onMouseLeave={() => setHoveredSlice(null)}
                />
              )}
            </svg>

            {/* Center Label in Donut Hole */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
              <span className="text-sm sm:text-base font-extrabold text-gray-900 tracking-tight leading-tight">
                {formatIndianCurrency(result.totalRepayment)}
              </span>
              <span className="text-[10px] sm:text-[11px] font-medium text-gray-500 uppercase tracking-wider mt-0.5">
                Total Repayment
              </span>
            </div>
          </div>

          {/* Legend beside the Donut Chart */}
          <div className="space-y-4 w-full sm:w-auto">
            {/* Principal Legend */}
            <div
              className={`p-2.5 rounded-xl transition ${
                hoveredSlice === 'principal' ? 'bg-emerald-50/80 ring-1 ring-emerald-200' : ''
              }`}
              onMouseEnter={() => setHoveredSlice('principal')}
              onMouseLeave={() => setHoveredSlice(null)}
            >
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#16a34a] flex-shrink-0" />
                <span className="text-xs font-semibold text-gray-600">
                  Principal Amount
                </span>
              </div>
              <div className="mt-1 pl-5">
                <span className="text-sm sm:text-base font-bold text-gray-900">
                  {formatIndianCurrency(result.loanAmount)}
                </span>
                <span className="text-xs text-gray-500 font-medium ml-1.5">
                  ({result.principalPercentage}%)
                </span>
              </div>
            </div>

            {/* Interest Legend */}
            <div
              className={`p-2.5 rounded-xl transition ${
                hoveredSlice === 'interest' ? 'bg-amber-50/80 ring-1 ring-amber-200' : ''
              }`}
              onMouseEnter={() => setHoveredSlice('interest')}
              onMouseLeave={() => setHoveredSlice(null)}
            >
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#f59e0b] flex-shrink-0" />
                <span className="text-xs font-semibold text-gray-600">
                  Total Interest
                </span>
              </div>
              <div className="mt-1 pl-5">
                <span className="text-sm sm:text-base font-bold text-gray-900">
                  {formatIndianCurrency(result.totalInterest)}
                </span>
                <span className="text-xs text-gray-500 font-medium ml-1.5">
                  ({result.interestPercentage}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
