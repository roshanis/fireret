import { useForm } from 'react-hook-form';
import { SimulationInputs } from '../../types/simulation';

interface Props {
  initialValues: SimulationInputs;
  onSubmit: (data: SimulationInputs) => void;
  onNext: () => void;
  currentStep: number;
  totalSteps: number;
}

export default function InvestmentAssumptionsStep({ initialValues, onSubmit, onNext, currentStep, totalSteps }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<SimulationInputs>({
    defaultValues: initialValues
  });

  const handleNext = (data: SimulationInputs) => {
    onSubmit(data);
    if (currentStep !== totalSteps - 1) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit(handleNext)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Expected Annual Return (%)
        </label>
        <input
          {...register('expectedReturn', { 
            required: "Required field",
            min: { value: 0, message: "Minimum 0%" },
            max: { value: 20, message: "Maximum 20%" }
          })}
          type="number"
          step="0.1"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.expectedReturn && (
          <p className="mt-2 text-sm text-red-600">{errors.expectedReturn.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Inflation Rate (%)
        </label>
        <input
          {...register('inflationRate', { required: true, min: 0, max: 10 })}
          type="number"
          step="0.1"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.inflationRate && (
          <p className="mt-2 text-sm text-red-600">Enter 0-10%</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Market Volatility (%)
        </label>
        <input
          {...register('volatility', { required: true, min: 5, max: 50 })}
          type="number"
          step="0.1"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.volatility && (
          <p className="mt-2 text-sm text-red-600">Enter 5-50%</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Number of Simulations
        </label>
        <input
          {...register('simulationsCount', { 
            required: true, 
            min: { value: 100, message: "Minimum 100 simulations" },
            max: { value: 10000, message: "Maximum 10,000 simulations" }
          })}
          type="number"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.simulationsCount && (
          <p className="mt-2 text-sm text-red-600">Enter 100-10,000 simulations</p>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {currentStep === totalSteps - 1 ? 'Run Simulation' : 'Next'}
        </button>
      </div>
    </form>
  );
} 