import React from 'react';
import { Calculator, Check } from 'lucide-react';

interface HeaderProps {
  currentStep: 1 | 2;
  onNavigateToStep?: (step: 1 | 2) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentStep, onNavigateToStep }) => {
  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-gray-200/80 gap-4">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-[#1e5631] flex items-center justify-center text-white shadow-sm flex-shrink-0">
          <Calculator className="w-6 h-6 stroke-[2.2]" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight leading-tight">
            Bike EMI Calculator
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            Plan your dream bike with easy EMI calculations
          </p>
        </div>
      </div>

      {/* Stepper Navigation: Only 2 Steps (Loan Details & Results) */}
      <nav aria-label="Progress" className="flex items-center gap-2 self-end sm:self-auto">
        {/* Step 1: Loan Details */}
        <button
          type="button"
          onClick={() => onNavigateToStep && onNavigateToStep(1)}
          className={`flex items-center gap-2 transition group ${
            currentStep === 2 ? 'cursor-pointer' : 'cursor-default'
          }`}
          title="Go to Loan Details"
        >
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
              currentStep === 1
                ? 'bg-[#1e5631] text-white shadow-sm'
                : 'bg-[#1e5631] text-white'
            }`}
          >
            {currentStep === 2 ? <Check className="w-4 h-4 stroke-[2.5]" /> : '1'}
          </div>
          <span
            className={`text-xs font-semibold ${
              currentStep === 1 ? 'text-[#1e5631]' : 'text-gray-700 group-hover:text-[#1e5631]'
            }`}
          >
            Loan Details
          </span>
        </button>

        {/* Connector Line */}
        <div
          className={`w-8 sm:w-12 h-0.5 rounded transition ${
            currentStep === 2 ? 'bg-[#1e5631]' : 'bg-gray-200'
          }`}
        />

        {/* Step 2: Results */}
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
              currentStep === 2
                ? 'bg-[#1e5631] text-white shadow-sm ring-2 ring-[#1e5631]/20'
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            2
          </div>
          <span
            className={`text-xs font-semibold ${
              currentStep === 2 ? 'text-[#1e5631]' : 'text-gray-400'
            }`}
          >
            Results
          </span>
        </div>
      </nav>
    </header>
  );
};
