import React, { createContext, useContext, useState, useMemo } from 'react';
import { SimulationResults } from '../types/simulation';

type ScenarioAdjustments = {
  returnAdjustment: number;
  expenseAdjustment: number;
};

type ScenarioContextType = {
  adjustments: ScenarioAdjustments;
  setAdjustments: (adj: ScenarioAdjustments) => void;
  adjustedResults?: SimulationResults;
};

const defaultAdjustments: ScenarioAdjustments = {
  returnAdjustment: 0,
  expenseAdjustment: 0,
};

// Create the context with a default value
const ScenarioContext = createContext<ScenarioContextType>({
  adjustments: defaultAdjustments,
  setAdjustments: () => {},
  adjustedResults: undefined,
});

export function ScenarioProvider({ 
  children, 
  results 
}: { 
  children: React.ReactNode;
  results: SimulationResults;
}) {
  const [adjustments, setAdjustments] = useState<ScenarioAdjustments>(defaultAdjustments);

  const adjustedResults = useMemo(() => ({
    ...results,
    successProbability: Math.min(100, results.successProbability * 
      (1 + adjustments.returnAdjustment - adjustments.expenseAdjustment)),
  }), [results, adjustments]);

  return (
    <ScenarioContext.Provider 
      value={{
        adjustments,
        setAdjustments,
        adjustedResults
      }}
    >
      {children}
    </ScenarioContext.Provider>
  );
}

export function useScenario() {
  const context = useContext(ScenarioContext);
  if (!context) {
    throw new Error('useScenario must be used within a ScenarioProvider');
  }
  return context;
} 