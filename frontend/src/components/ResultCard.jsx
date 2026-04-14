import { useNavigate } from 'react-router-dom'

const levelConfig = {
  Extreme: { color: 'red', bg: 'bg-red-900/30', border: 'border-red-700', badge: 'bg-red-600', emoji: '🚨' },
  High:    { color: 'orange', bg: 'bg-orange-900/30', border: 'border-orange-700', badge: 'bg-orange-600', emoji: '⚠️' },
  Medium:  { color: 'yellow', bg: 'bg-yellow-900/30', border: 'border-yellow-700', badge: 'bg-yellow-600', emoji: '📊' },
  Low:     { color: 'green', bg: 'bg-green-900/30', border: 'border-green-700', badge: 'bg-green-600', emoji: '✅' },
}

export default function ResultCard({ result }) {
  const navigate = useNavigate()
  const cfg = levelConfig[result.poverty_level] || levelConfig['Medium']

  return (
    <div className={`mt-8 ${cfg.bg} border ${cfg.border} rounded-2xl p-8 shadow-xl`}>
      <div className="text-center mb-6">
        <div className="text-5xl mb-3">{cfg.emoji}</div>
        <h2 className="text-2xl font-bold text-white mb-2">Prediction Result</h2>
        <span className={`${cfg.badge} text-white px-6 py-2 rounded-full text-lg font-bold`}>
          {result.poverty_level} Poverty
        </span>
        <p className="text-slate-400 mt-3">AI Confidence: <span className="text-white font-bold">{result.confidence}%</span></p>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-slate-300 text-sm">Confidence Score</span>
          <span className="text-white font-bold">{result.confidence}%</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-3">
          <div
            className={`${cfg.badge} h-3 rounded-full transition-all duration-1000`}
            style={{ width: `${result.confidence}%` }}
          />
        </div>
      </div>

      <button
        onClick={() => navigate(`/schemes?level=${result.poverty_level}`)}
        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl text-lg transition-all duration-200"
      >
        📋 View Recommended Schemes →
      </button>
    </div>
  )
}