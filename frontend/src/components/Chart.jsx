import { Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function Chart({ data }) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-slate-700 mb-6 md:mb-8">
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <Activity className="text-blue-400" size={20} />
        <h2 className="text-xl md:text-2xl font-bold">Histórico em Tempo Real</h2>
      </div>
      
      <div className="h-64 sm:h-72 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis 
              dataKey="time" 
              stroke="#64748b"
              tick={{fill: '#94a3b8', fontSize: 12}}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              stroke="#64748b"
              tick={{fill: '#94a3b8', fontSize: 12}}
              allowDecimals={false}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="count" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{fill: '#3b82f6', r: 3}}
              activeDot={{r: 5}}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Chart;
