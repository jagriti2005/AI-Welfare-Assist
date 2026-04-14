import { Link } from 'react-router-dom'

export default function Home() {
  const stats = [
    { label: 'People in Poverty', value: '228M+', icon: '👥' },
    { label: 'Govt Schemes Available', value: '50+', icon: '📋' },
    { label: 'States Covered', value: '28', icon: '🗺️' },
    { label: 'Prediction Accuracy', value: '95%+', icon: '🎯' },
  ]

  const features = [
    {
      icon: '🔮',
      title: 'Poverty Prediction',
      desc: 'AI-powered prediction based on 10+ socioeconomic factors',
      color: 'blue'
    },
    {
      icon: '📋',
      title: 'Scheme Recommendation',
      desc: 'Get personalized government scheme recommendations instantly',
      color: 'green'
    },
    {
      icon: '🔗',
      title: 'Direct Apply Links',
      desc: 'One-click access to apply for schemes with step-by-step guidance',
      color: 'purple'
    },
    {
      icon: '📊',
      title: 'Live Dashboard',
      desc: 'Visual analytics of poverty distribution across India',
      color: 'orange'
    },
  ]

  return (
    <div className="min-h-screen bg-slate-900">

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 py-24 px-6 text-center">
        <div className="absolute inset-0 opacity-10"
          style={{backgroundImage: 'radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 80% 20%, #8b5cf6 0%, transparent 50%)'}}>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-900/40 border border-blue-700 rounded-full px-4 py-2 mb-6">
            <span className="text-blue-400 text-sm">🤖 AI Powered • Real Government Data</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
            Predict Poverty.<br />
            <span className="text-blue-400">Recommend Solutions.</span>
          </h1>
          <p className="text-slate-300 text-xl mb-10 max-w-2xl mx-auto">
            AI-driven platform that predicts poverty levels and connects citizens with the right government welfare schemes instantly.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/predict"
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-blue-900/50">
              🔮 Start Prediction
            </Link>
            <Link to="/dashboard"
              className="bg-slate-700 hover:bg-slate-600 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200">
              📊 View Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto px-6 -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 text-center shadow-xl">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-blue-400">{stat.value}</div>
              <div className="text-slate-400 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center text-white mb-12">
          What AI Welfare Assist Does
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-slate-800 border border-slate-700 rounded-2xl p-8 hover:border-blue-600 transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/20">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
              <p className="text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border-t border-slate-700 py-16 text-center px-6">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to check eligibility?</h2>
        <p className="text-slate-400 mb-8">Takes less than 2 minutes. No registration required.</p>
        <Link to="/predict"
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-10 py-4 rounded-xl text-lg transition-all duration-200 inline-block">
          Get Started Free →
        </Link>
      </div>
    </div>
  )
}