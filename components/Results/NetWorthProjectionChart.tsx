import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SimulationResults } from '../../types/simulation';

type Props = {
  data?: SimulationResults['netWorthProjections'];
  originalData?: SimulationResults['netWorthProjections'];
};

export default function NetWorthProjectionChart({ data, originalData }: Props) {
  if (!data) return null;

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="year" 
            tickFormatter={(value) => value.toString()}
          />
          <YAxis 
            tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
          />
          <Tooltip 
            formatter={(value: number) => [`$${(value / 1000).toFixed(1)}K`, 'Net Worth']}
            labelFormatter={(year) => `Year: ${year}`}
          />
          <Legend />
          {originalData && (
            <Line
              type="monotone"
              data={originalData}
              dataKey="value"
              stroke="#8884d8"
              name="Original Projection"
              dot={false}
            />
          )}
          <Line
            type="monotone"
            dataKey="value"
            stroke="#82ca9d"
            name="Adjusted Projection"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="p95"
            stroke="#82ca9d"
            strokeDasharray="5 5"
            name="95th Percentile"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="p5"
            stroke="#82ca9d"
            strokeDasharray="5 5"
            name="5th Percentile"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 