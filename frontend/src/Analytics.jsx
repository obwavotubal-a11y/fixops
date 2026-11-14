import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Analytics({ tickets }) {
  // 1. Calculate data for the Donut Chart (Status)
  const openCount = tickets.filter(t => t.status === 'OPEN').length;
  const inProgressCount = tickets.filter(t => t.status === 'IN_PROGRESS').length;
  const completedCount = tickets.filter(t => t.status === 'COMPLETED').length;
  const total = tickets.length || 1; // Prevent division by zero

  const statusData = [
    { name: 'Open', value: openCount, color: '#64748b' },        // Slate
    { name: 'In Progress', value: inProgressCount, color: '#0ea5e9' }, // Blue
    { name: 'Completed', value: completedCount, color: '#10b981' }, // Emerald
  ];

  // 2. Dummy data for the Line Chart (Trends)
  const trendData = [
    { day: 'Mon', volume: 5 },
    { day: 'Tue', volume: 12 },
    { day: 'Wed', volume: 8 },
    { day: 'Thu', volume: 15 },
    { day: 'Fri', volume: 20 },
  ];

  // Custom label for the center of the donut chart
  const CustomLabel = ({ cx, cy }) => {
    const percentage = Math.round(((inProgressCount + openCount) / total) * 100);
    return (
      <text x={cx} y={cy} fill="white" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold">
        {percentage}%
      </text>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      
      {/* Donut Chart */}
      <div className="bg-panelBg border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-slate-200 font-medium mb-6">Repair Status Overview</h3>
        <div className="h-64 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: 'white' }}
                itemStyle={{ color: 'white' }}
              />
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="white" className="text-2xl font-bold">
                {Math.round(((inProgressCount) / total) * 100)}%
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-4">
          {statusData.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <span className="text-xs text-slate-400">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Line Chart */}
      <div className="bg-panelBg border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-slate-200 font-medium mb-6">Repair Volume Trends</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="day" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: 'white' }}
                itemStyle={{ color: '#0ea5e9' }}
              />
              <Line type="monotone" dataKey="volume" stroke="#0ea5e9" strokeWidth={3} dot={{ fill: '#0ea5e9', strokeWidth: 2 }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}