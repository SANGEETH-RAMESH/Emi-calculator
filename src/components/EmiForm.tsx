import React, { useState } from 'react';
import {
  Bike,
  Wallet,
  Coins,
  Percent,
  Calendar,
  Shield,
  FileSpreadsheet,
  Info,
  RotateCcw,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import type { EmiInputs, InterestMethod, ValidationErrors } from '../types/emi';
import {
  formatIndianCurrency,
  formatIndianNumber,
  parseCurrencyInput,
  validateInputs,
} from '../utils/emiCalculator';

interface EmiFormProps {
  inputs: EmiInputs;
  onInputChange: (updates: Partial<EmiInputs>) => void;
  onReset: () => void;
  onNext: () => void;
}

export const EmiForm: React.FC<EmiFormProps> = ({
  inputs,
  onInputChange,
  onReset,
  onNext,
}) => {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showMethodInfo, setShowMethodInfo] = useState(false);

  const loanAmount = Math.max(0, inputs.bikePrice - inputs.downPayment);

  // Helper to handle Bike Price change
  const handleBikePriceChange = (val: number) => {
    const newPrice = Math.max(0, val);
    const updates: Partial<EmiInputs> = { bikePrice: newPrice };
    // If down payment is now higher than bike price, clamp it
    if (inputs.downPayment > newPrice) {
      updates.downPayment = newPrice;
    }
    onInputChange(updates);
    if (errors.bikePrice || errors.downPayment) {
      setErrors((prev) => ({ ...prev, bikePrice: undefined, downPayment: undefined }));
    }
  };

  // Helper to handle Down Payment change
  const handleDownPaymentChange = (val: number) => {
    const newDp = Math.max(0, val);
    onInputChange({ downPayment: newDp });
    if (newDp > inputs.bikePrice) {
      setErrors((prev) => ({
        ...prev,
        downPayment: 'Down payment cannot exceed the vehicle price',
      }));
    } else {
      setErrors((prev) => ({ ...prev, downPayment: undefined }));
    }
  };

  const handleInterestRateChange = (val: number) => {
    onInputChange({ interestRate: val });
    if (errors.interestRate) {
      setErrors((prev) => ({ ...prev, interestRate: undefined }));
    }
  };

  const handleTenureChange = (years: number) => {
    onInputChange({ tenureYears: years });
    if (errors.tenureYears) {
      setErrors((prev) => ({ ...prev, tenureYears: undefined }));
    }
  };

  const handleMethodChange = (method: InterestMethod) => {
    onInputChange({ interestMethod: method });
  };

  const handleAdditionalChargesChange = (val: number) => {
    onInputChange({ additionalCharges: Math.max(0, val) });
    if (errors.additionalCharges) {
      setErrors((prev) => ({ ...prev, additionalCharges: undefined }));
    }
  };

  const handleNextClick = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateInputs(inputs);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    onNext();
  };

  // Slider progress calculation for background styling
  const bikePriceMin = 0;
  const bikePriceMax = 1000000;
  const bikePricePercent = Math.min(
    100,
    Math.max(0, (inputs.bikePrice / bikePriceMax) * 100)
  );

  const dpMax = Math.max(0, inputs.bikePrice);
  const dpPercent = dpMax > 0 ? Math.min(100, Math.max(0, (inputs.downPayment / dpMax) * 100)) : 0;

  const rateMax = 30;
  const ratePercent = Math.min(100, Math.max(0, (inputs.interestRate / rateMax) * 100));

  return (
    <form
      onSubmit={handleNextClick}
      className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-7 shadow-sm space-y-6"
    >
      {/* Form Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#1e5631] flex items-center justify-center flex-shrink-0">
          <FileSpreadsheet className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
            Enter Loan Details
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Provide your bike and loan details to calculate EMI
          </p>
        </div>
      </div>

      {/* Field 1: Bike Price (On-road) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center flex-shrink-0">
              <Bike className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <label htmlFor="bike-price-input" className="text-sm font-semibold text-gray-800 block">
                Bike Price (On-road)
              </label>
              <span className="text-[11px] text-gray-400 block -mt-0.5">
                Total on-road price of the bike
              </span>
            </div>
          </div>

          {/* Formatted Number Input */}
          <div className="relative">
            <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-1.5 focus-within:border-[#1e5631] focus-within:ring-2 focus-within:ring-[#1e5631]/10 focus-within:bg-white transition">
              <span className="text-sm font-semibold text-gray-600 mr-1.5">₹</span>
              <input
                id="bike-price-input"
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={inputs.bikePrice > 0 ? formatIndianNumber(inputs.bikePrice) : ''}
                onChange={(e) => handleBikePriceChange(parseCurrencyInput(e.target.value))}
                className="w-28 sm:w-32 text-right text-sm font-bold text-gray-900 bg-transparent focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Range Slider */}
        <div className="pt-2">
          <input
            id="bike-price-slider"
            aria-label="Bike Price Slider"
            type="range"
            min={bikePriceMin}
            max={bikePriceMax}
            step={5000}
            value={inputs.bikePrice || 0}
            onChange={(e) => handleBikePriceChange(Number(e.target.value))}
            style={{
              background: `linear-gradient(to right, #1e5631 0%, #1e5631 ${bikePricePercent}%, #e2e8f0 ${bikePricePercent}%, #e2e8f0 100%)`,
            }}
          />
          <div className="flex justify-between items-center text-[11px] text-gray-500 font-medium mt-1">
            <span>₹ 0</span>
            <span>₹ 10,00,000</span>
          </div>
        </div>

        {errors.bikePrice && (
          <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.bikePrice}
          </p>
        )}
      </div>

      {/* Field 2: Down Payment */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center flex-shrink-0">
              <Wallet className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <label htmlFor="down-payment-input" className="text-sm font-semibold text-gray-800 block">
                Down Payment
              </label>
              <span className="text-[11px] text-gray-400 block -mt-0.5">
                Amount you will pay upfront
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-1.5 focus-within:border-[#1e5631] focus-within:ring-2 focus-within:ring-[#1e5631]/10 focus-within:bg-white transition">
              <span className="text-sm font-semibold text-gray-600 mr-1.5">₹</span>
              <input
                id="down-payment-input"
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={inputs.downPayment > 0 ? formatIndianNumber(inputs.downPayment) : ''}
                onChange={(e) => handleDownPaymentChange(parseCurrencyInput(e.target.value))}
                className="w-28 sm:w-32 text-right text-sm font-bold text-gray-900 bg-transparent focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Range Slider */}
        <div className="pt-2">
          <input
            id="down-payment-slider"
            aria-label="Down Payment Slider"
            type="range"
            min={0}
            max={dpMax}
            step={1000}
            value={Math.min(inputs.downPayment, dpMax)}
            onChange={(e) => handleDownPaymentChange(Number(e.target.value))}
            style={{
              background: `linear-gradient(to right, #1e5631 0%, #1e5631 ${dpPercent}%, #e2e8f0 ${dpPercent}%, #e2e8f0 100%)`,
            }}
          />
          <div className="flex justify-between items-center text-[11px] text-gray-500 font-medium mt-1">
            <span>₹ 0</span>
            <span>{formatIndianCurrency(inputs.bikePrice)}</span>
          </div>
        </div>

        {errors.downPayment && (
          <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.downPayment}
          </p>
        )}
      </div>

      {/* Field 3: Loan Amount (Auto Calculated Highlight Card) */}
      <div className="rounded-xl bg-[#edf7ed] border border-emerald-200/70 p-4 flex items-center justify-between transition-all">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white text-[#1e5631] flex items-center justify-center shadow-xs">
            <Coins className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-sm font-bold text-[#143d23] block leading-tight">
              Loan Amount
            </span>
            <span className="text-xs text-emerald-800 font-medium">
              (Auto calculated)
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xl sm:text-2xl font-extrabold text-[#1e5631] tracking-tight">
            {formatIndianCurrency(loanAmount)}
          </span>
        </div>
      </div>

      {/* Field 4: Annual Interest Rate */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center flex-shrink-0">
              <Percent className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <label htmlFor="interest-rate-input" className="text-sm font-semibold text-gray-800 block">
                Annual Interest Rate
              </label>
              <span className="text-[11px] text-gray-400 block -mt-0.5">
                Interest rate charged by the lender
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-1.5 focus-within:border-[#1e5631] focus-within:ring-2 focus-within:ring-[#1e5631]/10 focus-within:bg-white transition">
              <input
                id="interest-rate-input"
                type="number"
                step="0.1"
                min="0"
                max="30"
                placeholder="0"
                value={inputs.interestRate > 0 ? inputs.interestRate : ''}
                onChange={(e) => handleInterestRateChange(parseFloat(e.target.value) || 0)}
                className="w-16 sm:w-20 text-right text-sm font-bold text-gray-900 bg-transparent focus:outline-none"
              />
              <span className="text-sm font-semibold text-gray-500 ml-1.5">%</span>
            </div>
          </div>
        </div>

        {/* Range Slider */}
        <div className="pt-2">
          <input
            id="interest-rate-slider"
            aria-label="Annual Interest Rate Slider"
            type="range"
            min={0}
            max={rateMax}
            step={0.1}
            value={inputs.interestRate || 0}
            onChange={(e) => handleInterestRateChange(Number(e.target.value))}
            style={{
              background: `linear-gradient(to right, #1e5631 0%, #1e5631 ${ratePercent}%, #e2e8f0 ${ratePercent}%, #e2e8f0 100%)`,
            }}
          />
          <div className="flex justify-between items-center text-[11px] text-gray-500 font-medium mt-1">
            <span>0%</span>
            <span>30%</span>
          </div>
        </div>

        {errors.interestRate && (
          <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.interestRate}
          </p>
        )}
      </div>

      {/* Field 5: Loan Tenure */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-800 block">
                Loan Tenure
              </span>
              <span className="text-[11px] text-gray-400 block -mt-0.5">
                Select loan duration
              </span>
            </div>
          </div>

          {/* Tenure Pill Buttons (1 to 5 years) */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            {[1, 2, 3, 4, 5].map((year) => {
              const isSelected = inputs.tenureYears === year;
              return (
                <button
                  key={year}
                  type="button"
                  id={`tenure-btn-${year}`}
                  onClick={() => handleTenureChange(year)}
                  className={`px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-[#1e5631] text-white shadow-xs'
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {year} {year === 1 ? 'Year' : 'Years'}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Field 6: Interest Calculation Method */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-800">
            Interest Calculation Method
          </span>
          <button
            type="button"
            aria-label="Information about calculation method"
            onClick={() => setShowMethodInfo(!showMethodInfo)}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

        {showMethodInfo && (
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3 text-xs text-emerald-900 space-y-1">
            <p>
              <strong>Reducing Balance:</strong> Monthly interest is calculated only on the remaining outstanding principal. This is the standard banking method.
            </p>
            <p>
              <strong>Flat Rate:</strong> Interest is calculated on the entire initial loan amount for the whole tenure, resulting in higher total interest.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Option: Reducing Balance */}
          <div
            id="method-reducing"
            onClick={() => handleMethodChange('reducing')}
            className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex items-start gap-3 ${
              inputs.interestMethod === 'reducing'
                ? 'border-[#1e5631] bg-[#f0f9f3]'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="mt-0.5">
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  inputs.interestMethod === 'reducing'
                    ? 'border-[#1e5631]'
                    : 'border-gray-300'
                }`}
              >
                {inputs.interestMethod === 'reducing' && (
                  <div className="w-2 h-2 rounded-full bg-[#1e5631]" />
                )}
              </div>
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-gray-900 block leading-tight">
                Reducing Balance
              </span>
              <span className="text-[11px] text-gray-500 block mt-0.5">
                Interest on remaining balance
              </span>
            </div>
          </div>

          {/* Option: Flat Rate */}
          <div
            id="method-flat"
            onClick={() => handleMethodChange('flat')}
            className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex items-start gap-3 ${
              inputs.interestMethod === 'flat'
                ? 'border-[#1e5631] bg-[#f0f9f3]'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="mt-0.5">
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  inputs.interestMethod === 'flat'
                    ? 'border-[#1e5631]'
                    : 'border-gray-300'
                }`}
              >
                {inputs.interestMethod === 'flat' && (
                  <div className="w-2 h-2 rounded-full bg-[#1e5631]" />
                )}
              </div>
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-gray-900 block leading-tight">
                Flat Rate
              </span>
              <span className="text-[11px] text-gray-500 block mt-0.5">
                Interest on full loan amount
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Field 7: Additional Charges (Optional) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <label htmlFor="additional-charges-input" className="text-sm font-semibold text-gray-800 block">
                Additional Charges (Optional)
              </label>
              <span className="text-[11px] text-gray-400 block -mt-0.5">
                Processing fee, insurance, etc.
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-1.5 focus-within:border-[#1e5631] focus-within:ring-2 focus-within:ring-[#1e5631]/10 focus-within:bg-white transition">
              <span className="text-sm font-semibold text-gray-600 mr-1.5">₹</span>
              <input
                id="additional-charges-input"
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={inputs.additionalCharges > 0 ? formatIndianNumber(inputs.additionalCharges) : ''}
                onChange={(e) => handleAdditionalChargesChange(parseCurrencyInput(e.target.value))}
                className="w-28 sm:w-32 text-right text-sm font-bold text-gray-900 bg-transparent focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="pt-2 flex items-center gap-3">
        <button
          type="button"
          id="btn-reset"
          onClick={onReset}
          className="px-4 py-3.5 rounded-xl border border-gray-200 text-gray-600 hover:text-gray-800 hover:bg-gray-50 font-semibold text-sm flex items-center justify-center gap-2 transition"
          title="Reset to default values"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>

        <button
          type="submit"
          id="btn-next-view-results"
          className="flex-1 bg-[#1e5631] hover:bg-[#164426] text-white font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-sm transition transform active:scale-[0.99]"
        >
          <span>Next: View Results</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </form>
  );
};
