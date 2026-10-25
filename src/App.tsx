import { useState, useMemo } from 'react';
import type { EmiInputs } from './types/emi';
import { calculateEmi, DEFAULT_EMI_INPUTS } from './utils/emiCalculator';
import { Header } from './components/Header';
import { EmiForm } from './components/EmiForm';
import { HeroCard } from './components/HeroCard';
import { EmiResults } from './components/EmiResults';

export function App() {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [inputs, setInputs] = useState<EmiInputs>(DEFAULT_EMI_INPUTS);

  // Dynamic EMI Calculation
  const result = useMemo(() => {
    return calculateEmi(inputs);
  }, [inputs]);

  // Handle input changes while preserving existing fields
  const handleInputChange = (updates: Partial<EmiInputs>) => {
    setInputs((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  // Reset form to initial default values
  const handleReset = () => {
    setInputs(DEFAULT_EMI_INPUTS);
  };

  // Navigate between steps
  const handleNavigateToStep = (step: 1 | 2) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-gray-800 py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header with 2-step indicator */}
        <Header
          currentStep={currentStep}
          onNavigateToStep={handleNavigateToStep}
        />

        {/* Main Content: Step 1 vs Step 2 */}
        <main>
          {currentStep === 1 ? (
            /* Page 1: Loan Details */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Left Column: Form & Inputs (Order 2 on mobile, Order 1 on desktop) */}
              <div className="order-2 lg:order-1 lg:col-span-7">
                <EmiForm
                  inputs={inputs}
                  onInputChange={handleInputChange}
                  onReset={handleReset}
                  onNext={() => handleNavigateToStep(2)}
                />
              </div>

              {/* Right Column: Hero Bike Showcase & Features (Order 1 on mobile: appears first) */}
              <div className="order-1 lg:order-2 lg:col-span-5">
                <HeroCard />
              </div>
            </div>
          ) : (
            /* Page 2: EMI Results */
            <EmiResults
              inputs={inputs}
              result={result}
              onBack={() => handleNavigateToStep(1)}
              onEdit={() => handleNavigateToStep(1)}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
