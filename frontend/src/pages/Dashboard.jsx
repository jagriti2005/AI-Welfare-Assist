import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'

const barData = [
  { state: 'UP',        extreme: 35, high: 28, medium: 22, low: 15 },
  { state: 'Bihar',     extreme: 42, high: 30, medium: 18, low: 10 },
  { state: 'MH',        extreme: 15, high: 22, medium: 35, low: 28 },
  { state: 'Delhi',     extreme:  8, high: 15, medium: 30, low: 47 },
  { state: 'Rajasthan', extreme: 28, high: 32, medium: 25, low: 15 },
  { state: 'Kerala',    extreme:  5, high: 12, medium: 33, low: 50 },
]

const pieData = [
  { name: 'Extreme', value: 22 },
  { name: 'High',    value: 28 },
  { name: 'Medium',  value: 30 },
  { name: 'Low',     value: 20 },
]

const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#22c55e']

const tooltipStyle = {
  backgroundColor: '#0d1c38',
  border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: '10px',
  color: '#eef2ff',
  fontSize: '12px',
}

export default function Dashboard() {
  const cards = [
    { label: 'Total Predictions', value: '12,847', change: '+234 today',    icon: '🔮', accent: '#3b82f6', iconBg: 'rgba(59,130,246,0.14)'  },
    { label: 'Extreme Poverty',   value: '22%',    change: '−2% this month', icon: '🚨', accent: '#ef4444', iconBg: 'rgba(239,68,68,0.14)'   },
    { label: 'Schemes Applied',   value: '8,392',  change: '+156 today',    icon: '📋', accent: '#22c55e', iconBg: 'rgba(34,197,94,0.14)'   },
    { label: 'States Covered',    value: '28',     change: 'All India',     icon: '🗺️', accent: '#a78bfa', iconBg: 'rgba(167,139,250,0.14)' },
  ]

  const levels = [
    { pct: '22%', name: 'Extreme Poverty', desc: '4 schemes available', color: '#ef4444' },
    { pct: '28%', name: 'High Poverty',    desc: '3 schemes available', color: '#f97316' },
    { pct: '30%', name: 'Medium Poverty',  desc: '3 schemes available', color: '#f59e0b' },
    { pct: '20%', name: 'Low Poverty',     desc: '3 schemes available', color: '#22c55e' },
  ]

  return (
    <div className="page-wrap">

      {/* Header */}
      <div className="page-header">
        <div className="container">
          <p className="t-eyebrow" style={{ marginBottom: '10px' }}>Analytics</p>
          <h1 className="t-display-lg" style={{ marginBottom: '8px' }}>Dashboard</h1>
          <p className="t-body-sm">Real-time poverty distribution across India</p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '40px' }}>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '28px' }}>
          {cards.map((c, i) => (
            <div key={i} className="dash-stat">
              <div className="dash-stat__icon" style={{ background: c.iconBg }}>{c.icon}</div>
              <div className="dash-stat__val">{c.value}</div>
              <div className="dash-stat__lbl">{c.label}</div>
              <div className="dash-stat__change" style={{ color: c.accent }}>{c.change}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>

          <div className="chart-card">
            <p className="chart-card__title">Poverty by State</p>
            <p className="chart-card__sub">Distribution across 6 major states</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barData} barSize={7} barGap={2}>
                <XAxis dataKey="state" stroke="transparent"
                  tick={{ fill: 'rgba(238,242,255,0.35)', fontSize: 11 }} tickLine={false} />
                <YAxis stroke="transparent"
                  tick={{ fill: 'rgba(238,242,255,0.35)', fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="extreme" fill="#ef4444" name="Extreme" radius={[3,3,0,0]} />
                <Bar dataKey="high"    fill="#f97316" name="High"    radius={[3,3,0,0]} />
                <Bar dataKey="medium"  fill="#f59e0b" name="Medium"  radius={[3,3,0,0]} />
                <Bar dataKey="low"     fill="#22c55e" name="Low"     radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <p className="chart-card__title">National Distribution</p>
            <p className="chart-card__sub">Poverty level breakdown across India</p>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%"
                  outerRadius={95} innerRadius={48}
                  dataKey="value" paddingAngle={3}
                  label={({ value }) => `${value}%`} labelLine={false}
                >
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend
                  iconType="circle" iconSize={8}
                  formatter={v => (
                    <span style={{ color: 'rgba(238,242,255,0.55)', fontSize: '12px' }}>{v}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Level summary row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px' }}>
          {levels.map((l, i) => (
            <div key={i} className="level-pill" style={{ borderLeft: `3px solid ${l.color}` }}>
              <div className="level-pill__pct" style={{ color: l.color }}>{l.pct}</div>
              <div className="level-pill__name">{l.name}</div>
              <div className="level-pill__desc">{l.desc}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}