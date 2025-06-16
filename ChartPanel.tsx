
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { TimeSeriesDataPoint } from '../types';

interface ChartPanelProps {
  data: TimeSeriesDataPoint[];
}

export const ChartPanel: React.FC<ChartPanelProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg shadow text-gray-300 h-64 flex items-center justify-center">
        No chart data available. Run analysis to generate.
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-2 md:p-4 rounded-lg shadow-md h-80 md:h-96 text-xs">
      <h3 className="text-lg font-semibold text-gray-100 mb-1 md:mb-3 text-center">Rainfall & Runoff Time Series</h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 20, left: -20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" /> {/* gray-600 */}
          <XAxis 
            dataKey="date" 
            stroke="#A0AEC0" /* gray-400 */
            tickFormatter={(tick) => new Date(tick).toLocaleDateString('en-CA', {month:'short', day:'numeric'})} // Short date format
            angle={-30}
            textAnchor="end"
            height={50}
          />
          <YAxis stroke="#A0AEC0" /* gray-400 */ label={{ value: 'Depth (mm)', angle: -90, position: 'insideLeft', fill: '#A0AEC0', dx: -5 }} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#2D3748', border: '1px solid #4A5568', borderRadius: '0.375rem' }} 
            labelStyle={{ color: '#E2E8F0' }} 
            itemStyle={{ color: '#CBD5E0' }}
          />
          <Legend wrapperStyle={{ color: '#CBD5E0', paddingTop: '10px' }} />
          <Line type="monotone" dataKey="precipitation" stroke="#3B82F6" strokeWidth={2} name="Precipitation (mm)" dot={false} /> {/* blue-500 */}
          <Line type="monotone" dataKey="runoff" stroke="#EF4444" strokeWidth={2} name="Runoff (mm)" dot={false} /> {/* red-500 */}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
