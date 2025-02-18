import { useForm } from 'react-hook-form';
import { SimulationInputs } from '../../types/simulation';
import { US_STATES } from '../../constants/usStates';

const states = [
  'Alabama', 'Alaska', 'Arizona', /*...*/, 'Wyoming'
];

const maritalStatusOptions = [
  'Single', 'Married', 'Divorced', 'Widowed', 'Separated', 'Domestic Partnership'
];

const healthCoverageOptions = [
  'Employer-sponsored', 'Private', 'None', 'Other'
];

const healthStatusOptions = [
  'Excellent', 'Good', 'Fair', 'Poor'
];

type Props = {
  initialValues: SimulationInputs;
  onSubmit: (data: SimulationInputs) => void;
  onNext: () => void;
};

export default function BasicInfoStep({ initialValues, onSubmit, onNext }: Props) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<SimulationInputs>({
    defaultValues: initialValues
  });

  const showHealthSection = watch('includeHealthInfo');

  const handleNext = (data: SimulationInputs) => {
    onSubmit(data);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(handleNext)} className="space-y-6">
      {/* Demographic Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Demographic Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Current Age *
            </label>
            <input
              {...register('currentAge', { required: true, min: 18, max: 100 })}
              type="number"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.currentAge && (
              <p className="mt-2 text-sm text-red-600">Please enter a valid age (18-100)</p>
            )}
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              State of Residence
            </label>
            <select
              id="location"
              {...register('location', { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            >
              {US_STATES.map(state => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Marital Status
            </label>
            <select
              {...register('maritalStatus')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {maritalStatusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Number of Dependents
            </label>
            <input
              {...register('dependents', { min: 0, max: 10 })}
              type="number"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Occupation/Industry
          </label>
          <input
            {...register('occupation')}
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Optional Health Section */}
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('includeHealthInfo')}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 text-sm text-gray-900">
            Include Health Information
          </label>
        </div>

        {showHealthSection && (
          <div className="space-y-4 pl-6 border-l-2 border-blue-200">
            <h3 className="text-lg font-medium">Health Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Health Coverage
                </label>
                <select
                  {...register('healthCoverage')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {healthCoverageOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Health Status
                </label>
                <select
                  {...register('healthStatus')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {healthStatusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Next
        </button>
      </div>
    </form>
  );
} 