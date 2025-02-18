import { useEffect, useState } from 'react';
import { useFireSimulation } from '../context/FireSimulationContext';
import Spinner from '../components/Common/Spinner';
//import AnnualExpensesTimeline from '../components/Results/AnnualExpensesTimeline';
import { ScenarioProvider, useScenario } from '../context/ScenarioContext';
import ScenarioControls from '../components/Results/ScenarioControls';
import NetWorthProjectionChart from '../components/Results/NetWorthProjectionChart';  
import { SimulationResults } from '@/types/simulation';

export default function ResultsPage() {
  const { results } = useFireSimulation();
  const [localResults, setLocalResults] = useState<SimulationResults | null>(null);

  useEffect(() => {
    if (results) {
      setLocalResults(results);
    } else if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fireSimulationResults');
      if (saved) setLocalResults(JSON.parse(saved));
    }
  }, [results]);

  if (!localResults) return <div>No simulation results found</div>;

  return (
    <ScenarioProvider results={localResults}>
      <div className="max-w-7xl mx-auto p-4 space-y-8">
        <ScenarioControls />
        <ScenarioResults />
      </div>
    </ScenarioProvider>
  );
}

function ScenarioResults() {
  const { adjustedResults } = useScenario();
  const { results: originalResults } = useFireSimulation();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold">Original Plan</h3>
          <p className="text-2xl">
            {originalResults?.successProbability}% Success
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold">Adjusted Scenario</h3>
          <p className="text-2xl">
            {adjustedResults?.successProbability}% Success
          </p>
        </div>
      </div>

      <NetWorthProjectionChart 
        data={adjustedResults?.netWorthProjections} 
        originalData={originalResults?.netWorthProjections}
      />
    </>
  );
} 