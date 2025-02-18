import { SimulationInputs } from '../types/simulation';
import { useState } from 'react';
import { useFireSimulation } from '../context/FireSimulationContext';
import BasicInfoStep from '../components/Wizard/BasicInfoStep';
import IncomeRiskStep from '../components/Wizard/IncomeRiskStep';
import InvestmentAssumptionsStep from '../components/Wizard/InvestmentAssumptionsStep';
import ProgressBar from '../components/Wizard/ProgressBar';
import Spinner from '../components/Common/Spinner';
import { useRouter } from 'next/router';

const steps = [BasicInfoStep, IncomeRiskStep, InvestmentAssumptionsStep];

export default function HomePage() {
  const { inputs, setInputs, setResults } = useFireSimulation();
  const [currentStep, setCurrentStep] = useState(0);
  const [submissionError, setSubmissionError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (finalData: SimulationInputs) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/runFireSimulation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
      });

      if (!response.ok) {
        throw new Error('Simulation failed');
      }
      
      const results = await response.json();
      setResults(results);
      localStorage.setItem('fireSimulationResults', JSON.stringify(results));
      router.push('/results');
    } catch (error) {
      setSubmissionError(
        error instanceof Error ? error.message : 'Failed to run simulation'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStepSubmit = (data: SimulationInputs) => {
    const updatedInputs = { ...inputs, ...data };
    setInputs(updatedInputs);
    if (currentStep === steps.length - 1) {
      handleSubmit(updatedInputs);
    } else {
      handleStepNext();
    }
  };

  const handleStepNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <ProgressBar currentStep={currentStep} totalSteps={steps.length} />
      {steps.map((StepComponent, index) => (
        currentStep === index && (
          <StepComponent
            key={index}
            initialValues={inputs}
            onSubmit={handleStepSubmit}
            onNext={handleStepNext}
            currentStep={index}
            totalSteps={steps.length}
          />
        )
      ))}
      {submissionError && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
          Error: {submissionError}
        </div>
      )}
      <div className="flex justify-end mt-6">
        <button
          type={currentStep === steps.length - 1 ? 'submit' : 'button'}
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-75"
        >
          {isSubmitting ? (
            <Spinner className="mr-2" />
          ) : currentStep === steps.length - 1 ? (
            'Run Simulation'
          ) : (
            'Next'
          )}
        </button>
      </div>
    </div>
  );
} 