import React from 'react';
import {
  Calculator,
  CheckCircle2,
  Calendar,
  Percent,
  Coins,
  Hash,
  BarChart2,
  Shield,
  Info,
  ArrowLeft,
  RotateCcw,
  Trophy,
} from 'lucide-react';
import type { EmiInputs, EmiResult } from '../types/emi';
import { formatIndianCurrency } from '../utils/emiCalculator';
import { EmiSummary } from './EmiSummary';
import { EmiChart } from './EmiChart';
import { LoanDetailsSummary } from './LoanDetailsSummary';

interface EmiResultsProps {
  inputs: EmiInputs;
  result: EmiResult;
  onBack: () => void;
  onEdit: () => void;
}

export const EmiResults: React.FC<EmiResultsProps> = ({
  inputs,
  result,
  onBack,
  onEdit,
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Primary Highlight Banner (Monthly EMI) */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-7 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        {/* Left: Monthly EMI large display */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#1e5631] flex items-center justify-center flex-shrink-0">
            <Calculator className="w-7 h-7 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider block">
              Monthly EMI
            </span>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#1b5e20] tracking-tight">
                {formatIndianCurrency(result.monthlyEmi)}
              </span>
              <span className="text-xs sm:text-sm text-gray-500 font-medium">
                for {result.tenureYears} {result.tenureYears === 1 ? 'Year' : 'Years'} ({result.totalMonths} months)
              </span>
            </div>
          </div>
        </div>

        {/* Right: Validation / Confidence Badge */}
        <div className="bg-[#edf7ed] border border-emerald-200/80 rounded-xl px-4 py-3 flex items-center gap-3 w-full md:w-auto">
          <CheckCircle2 className="w-5 h-5 text-[#1e5631] flex-shrink-0" />
          <div>
            <span className="text-xs sm:text-sm font-bold text-gray-900 block leading-tight">
              Based on your loan details
            </span>
            <span className="text-[11px] sm:text-xs text-gray-600 font-medium block">
              Here's your estimated EMI and loan breakdown
            </span>
          </div>
        </div>
      </div>

      {/* 2. Four Prominent Summary Cards */}
      <EmiSummary result={result} />

      {/* 3. Main Breakdown & Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left & Middle Column (8 cols): Breakdown, Key Numbers, Formula */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          {/* Subgrid: Donut Chart + Key Numbers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Donut Chart */}
            <EmiChart result={result} />

            {/* Key Numbers Card */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="pb-3 border-b border-gray-100">
                  <h3 className="text-base font-bold text-gray-900 tracking-tight">
                    Key Numbers
                  </h3>
                  <p className="text-xs text-gray-400">
                    Important details about your loan
                  </p>
                </div>

                <div className="divide-y divide-gray-100 text-xs sm:text-sm pt-1">
                  <div className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>Loan Tenure</span>
                    </div>
                    <span className="font-bold text-gray-900">
                      {result.tenureYears} Years ({result.totalMonths} months)
                    </span>
                  </div>

                  <div className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Percent className="w-4 h-4 text-gray-400" />
                      <span>Interest Rate (p.a.)</span>
                    </div>
                    <span className="font-bold text-gray-900">
                      {result.interestRate}%
                    </span>
                  </div>

                  <div className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Coins className="w-4 h-4 text-gray-400" />
                      <span>Monthly EMI</span>
                    </div>
                    <span className="font-bold text-[#1e5631]">
                      {formatIndianCurrency(result.monthlyEmi)}
                    </span>
                  </div>

                  <div className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Hash className="w-4 h-4 text-gray-400" />
                      <span>Total Number of EMIs</span>
                    </div>
                    <span className="font-bold text-gray-900">
                      {result.totalMonths}
                    </span>
                  </div>

                  <div className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <BarChart2 className="w-4 h-4 text-gray-400" />
                      <span>Interest Calculation</span>
                    </div>
                    <span className="font-bold text-gray-900">
                      {result.interestMethod === 'reducing' ? 'Reducing Balance' : 'Flat Rate'}
                    </span>
                  </div>

                  <div className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Shield className="w-4 h-4 text-gray-400" />
                      <span>Additional Charges</span>
                    </div>
                    <span className="font-bold text-gray-900">
                      {formatIndianCurrency(result.additionalCharges)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* EMI Formula Card */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <h3 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight">
                EMI Formula Used ({result.interestMethod === 'reducing' ? 'Reducing Balance' : 'Flat Rate'})
              </h3>
              <Info className="w-4 h-4 text-gray-400" />
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              {/* Formula Display Box */}
              <div className="bg-gray-50 border border-gray-200/70 rounded-xl p-4 flex items-center justify-center font-mono text-xs sm:text-sm text-gray-800">
                {result.interestMethod === 'reducing' ? (
                  <div className="flex items-center gap-2">
                    <span className="font-bold">EMI =</span>
                    <div className="flex flex-col items-center">
                      <span className="border-b border-gray-400 pb-0.5 px-2 font-semibold">
                        P × r × (1 + r)ⁿ
                      </span>
                      <span className="pt-0.5 px-2 font-semibold">
                        (1 + r)ⁿ − 1
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1 text-center">
                    <div>
                      <span className="font-semibold text-gray-600">Interest = </span>
                      <span className="font-bold">P × (R / 100) × Tenure</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-600">EMI = </span>
                      <span className="font-bold">(P + Total Interest) / n</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Substituted Parameters */}
              <div className="text-xs text-gray-600 space-y-1.5 pl-2">
                <div>
                  <span className="font-semibold text-gray-800">P</span> = Loan amount ({formatIndianCurrency(result.loanAmount)})
                </div>
                {result.interestMethod === 'reducing' ? (
                  <div>
                    <span className="font-semibold text-gray-800">r</span> = Monthly interest rate ({result.interestRate}% / 12)
                  </div>
                ) : (
                  <div>
                    <span className="font-semibold text-gray-800">R</span> = Annual interest rate ({result.interestRate}%)
                  </div>
                )}
                <div>
                  <span className="font-semibold text-gray-800">n</span> = Total number of payments ({result.totalMonths})
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols / 4 cols): Bike Showcase, Motivational Badge, Your Loan Details */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-5">
          {/* Bike Card */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm overflow-hidden">
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                Triumph
              </span>
              <h4 className="text-xl font-extrabold text-gray-900 tracking-tight">
                Speed 400
              </h4>
              <p className="text-xs text-gray-500 font-medium">
                Performance. Style. Freedom.
              </p>
            </div>

            <div className="mt-3 relative rounded-xl overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100 p-2 flex items-center justify-center">
              <img
                src="/speed_400.png"
                alt="Triumph Speed 400"
                className="w-full max-h-48 object-contain rounded-lg"
              />
            </div>
          </div>

          {/* Motivational Badge */}
          <div className="bg-[#edf7ed] border border-emerald-200/80 rounded-2xl p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#1e5631] flex items-center justify-center flex-shrink-0 mt-0.5">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">
                You're one step closer!
              </h4>
              <p className="text-[11px] text-gray-600 mt-1 leading-snug font-medium">
                Review your results and compare different loan options to find the best plan for you.
              </p>
            </div>
          </div>

          {/* Your Loan Details with Edit Button */}
          <LoanDetailsSummary inputs={inputs} onEdit={onEdit} />
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200/80">
        <button
          type="button"
          id="btn-back-to-loan-details"
          onClick={onBack}
          className="w-full sm:w-auto px-5 py-3 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-semibold text-sm flex items-center justify-center gap-2 transition shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Loan Details</span>
        </button>

        <button
          type="button"
          id="btn-calculate-again"
          onClick={onEdit}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#1e5631] hover:bg-[#164426] text-white font-semibold text-sm flex items-center justify-center gap-2 transition shadow-sm"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Edit Details / Calculate Again</span>
        </button>
      </div>
    </div>
  );
};
