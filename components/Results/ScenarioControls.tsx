import { Slider } from '@mui/material';
import { useScenario } from '../../context/ScenarioContext';

export default function ScenarioControls() {
  const { adjustments, setAdjustments } = useScenario();
  
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Scenario Adjustments</h3>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Expected Returns (±%)
            <span className="ml-2 text-blue-600">
              {adjustments.returnAdjustment * 100}%
            </span>
          </label>
          <Slider
            value={adjustments.returnAdjustment}
            min={-0.3}
            max={0.3}
            step={0.01}
            onChange={(e, value) => setAdjustments({
              ...adjustments,
              returnAdjustment: value as number
            })}
            aria-labelledby="return-adjustment-slider"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Annual Expenses (±%)
            <span className="ml-2 text-red-600">
              {adjustments.expenseAdjustment * 100}%
            </span>
          </label>
          <Slider
            value={adjustments.expenseAdjustment}
            min={-0.2}
            max={0.5}
            step={0.01}
            onChange={(e, value) => setAdjustments({
              ...adjustments,
              expenseAdjustment: value as number
            })}
            aria-labelledby="expense-adjustment-slider"
          />
        </div>

        {/* Add similar controls for inflation and withdrawal rate */}
      </div>
    </div>
  );
} 