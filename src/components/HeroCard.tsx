import React from 'react';
import { Calculator, Clock, BarChart2, FileText } from 'lucide-react';

export const HeroCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-7 shadow-sm flex flex-col justify-between h-full">
      <div>
        {/* Title & Tagline */}
        <div className="mb-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#143d23] tracking-tight">
            Your <span className="text-[#1e5631]">Dream Bike</span>
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Calculate EMI and plan your purchase with confidence.
          </p>
        </div>

        {/* Bike Photo Showcase */}
        <div className="relative my-4 rounded-xl overflow-hidden bg-gradient-to-b from-gray-50/60 to-gray-100/60 border border-gray-100 flex items-center justify-center p-3 group">
          <img
            src="/speed_400.png"
            alt="Triumph Speed 400 Motorcycle"
            className="w-full max-h-72 object-contain rounded-lg transition-transform duration-500 group-hover:scale-[1.02]"
            loading="eager"
          />
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] font-semibold text-gray-700 shadow-xs border border-gray-200/60">
            Triumph Speed 400
          </div>
        </div>
      </div>

      {/* 4 Feature Badges in 2x2 Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-4 pt-4 border-t border-gray-100">
        {/* Feature 1 */}
        <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/70 border border-gray-100/80 hover:bg-white hover:shadow-xs transition">
          <div className="w-9 h-9 rounded-lg bg-emerald-100/70 text-emerald-800 flex items-center justify-center flex-shrink-0">
            <Calculator className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-900 leading-tight">
              Accurate Calculations
            </h3>
            <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
              Both reducing balance and flat rate methods
            </p>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/70 border border-gray-100/80 hover:bg-white hover:shadow-xs transition">
          <div className="w-9 h-9 rounded-lg bg-blue-100/70 text-blue-700 flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-900 leading-tight">
              Instant Results
            </h3>
            <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
              Get EMI and loan details instantly
            </p>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/70 border border-gray-100/80 hover:bg-white hover:shadow-xs transition">
          <div className="w-9 h-9 rounded-lg bg-amber-100/70 text-amber-700 flex items-center justify-center flex-shrink-0">
            <BarChart2 className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-900 leading-tight">
              Compare Options
            </h3>
            <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
              Easily compare different tenures
            </p>
          </div>
        </div>

        {/* Feature 4 */}
        <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/70 border border-gray-100/80 hover:bg-white hover:shadow-xs transition">
          <div className="w-9 h-9 rounded-lg bg-purple-100/70 text-purple-700 flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-900 leading-tight">
              Detailed Breakdown
            </h3>
            <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
              View complete payment details
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
