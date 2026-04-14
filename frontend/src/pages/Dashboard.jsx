import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

const barData = [
  { state: 'UP', extreme: 35, high: 28, medium: 22, low: 15 },
  { state: 'Bihar', extreme: 42, high: 30, medium: 18, low: 10 },
  { state: 'MH', extreme: 15, high: 22, medium: 35, low: 28 },
  { state: 'Delhi', extreme: 8, high: 15, medium: 30, low: 47 },
  { state: 'Rajasthan', extreme: 28, high: 32, medium: 25, low: 15 },
  { state: 'Kerala', extreme: 5, high: 12, medium: 33, low: 50 },
]

const pieData = [
  { name: 'Extreme Poverty', value: 22 },
  { name: 'High Poverty', value: 28 },
  { name: 'Medium Poverty', value: 30 },
  { name: 'Low Poverty', value: 20 },
]

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e']

export default function Dashboard() {
  const cards = [
    { label: 'Total Predictions', value: '12,847', change: '+234 today', icon: '🔮', color: 'blue' },
    { label: 'Extreme Poverty', value: '22%', change: '-2% this month', icon: '🚨', color: 'red' },
    { label: 'Schemes Applied', value: '8,392', change: '+156 today', icon: '📋', color: 'green' },
    { label: 'States Covered', value: '28', change: 'All India', icon: '🗺️', color: 'purple' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white mb-3">📊 Analytics Dashboard</h1>
        <p className="text-slate-400">Real-time poverty distribution across India</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {cards.map((c, i) => (
          <div key={i} className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
            <div className="text-3xl mb-2">{c.icon}</div>
            <div className="text-2xl font-bold text-white">{c.value}</div>
            <div className="text-slate-400 text-sm">{c.label}</div>
            <div className="text-green-400 text-xs mt-1">{c.change}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
          <h3 className="text-white font-bold mb-6">Poverty by State</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData}>
              <XAxis dataKey="state" stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
              <Bar dataKey="extreme" fill="#ef4444" name="Extreme" radius={[4,4,0,0]} />
              <Bar dataKey="high" fill="#f97316" name="High" radius={[4,4,0,0]} />
              <Bar dataKey="medium" fill="#eab308" name="Medium" radius={[4,4,0,0]} />
              <Bar dataKey="low" fill="#22c55e" name="Low" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
          <h3 className="text-white font-bold mb-6">National Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${value}%`}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}