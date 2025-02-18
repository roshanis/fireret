import { useForm } from 'react-hook-form';
import { SimulationInputs } from '../../types/simulation';

interface Props {
  initialValues: SimulationInputs;
  onSubmit: (data: SimulationInputs) => void;
  onNext: () => void;
}

export default function IncomeRiskStep({ initialValues, onSubmit, onNext }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<SimulationInputs>({
    defaultValues: initialValues,
  });

  const handleNext = (data: SimulationInputs) => {
    onSubmit(data);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(handleNext)} className="space-y-6">
      {/* Existing fields */}
      
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Emergency Fund Amount ($)
        </label>
        <input
          {...register('emergencyFundAmount', { 
            required: "Emergency fund amount is required",
            min: { value: 1000, message: "Minimum $1,000" },
            max: { value: 1000000, message: "Maximum $1,000,000" }
          })}
          type="number"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.emergencyFundAmount && (
          <p className="mt-2 text-sm text-red-600">{errors.emergencyFundAmount.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Max Unemployment Duration (months)
        </label>
        <input
          {...register('unemploymentDuration', { 
            required: true,
            min: 1,
            max: 36
          })}
          type="number"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.unemploymentDuration && (
          <p className="mt-2 text-sm text-red-600">
            {errors.unemploymentDuration.message || 'Invalid duration'}
          </p>
        )}
      </div>

      {/* Add similar fields for savingsRate and monteCarloVolatility */}
      
      <div className="flex justify-end mt-6">
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Next
        </button>
      </div>
    </form>
  );
} 