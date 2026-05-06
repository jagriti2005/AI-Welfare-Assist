import { useNavigate } from 'react-router-dom'

const cfg = {
  Extreme: {
    color: '#ef4444', bg: 'rgba(239,68,68,0.10)', border: 'rgba(239,68,68,0.28)',
    emoji: '🚨',
    msg: 'Immediate assistance recommended — several high-priority schemes are available for you.',
  },
  High: {
    color: '#f97316', bg: 'rgba(249,115,22,0.10)', border: 'rgba(249,115,22,0.28)',
    emoji: '⚠️',
    msg: 'Multiple welfare schemes are available to support your household right now.',
  },
  Medium: {
    color: '#f59e0b', bg: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.28)',
    emoji: '📊',
    msg: 'Targeted schemes can help improve your household\'s financial stability.',
  },
  Low: {
    color: '#22c55e', bg: 'rgba(34,197,94,0.10)', border: 'rgba(34,197,94,0.28)',
    emoji: '✅',
    msg: 'You are in a relatively stable position. Savings and insurance schemes are recommended.',
  },
}

export default function ResultCard({ result }) {
  const navigate = useNavigate()
  const c = cfg[result.poverty_level] || cfg['Medium']

  return (
    <div className="result-card" style={{ border: `1px solid ${c.border}`, borderLeft: `3px solid ${c.color}` }}>
      <span className="result-card__emoji">{c.emoji}</span>
      <span className="result-card__eyebrow">Prediction Result</span>

      <div>
        <span
          className="result-card__level"
          style={{ color: c.color, background: c.bg, borderColor: c.border }}
        >
          {result.poverty_level} Poverty Level
        </span>
      </div>

      <p className="result-card__msg">{c.msg}</p>

      <div className="conf-box">
        <div className="conf-box__row">
          <span className="conf-box__lbl">Model Confidence</span>
          <span className="conf-box__pct">{result.confidence}%</span>
        </div>
        <div className="conf-box__track">
          <div
            className="conf-box__fill"
            style={{ width: `${result.confidence}%`, background: c.color }}
          />
        </div>
      </div>

      <button
        onClick={() => navigate(`/schemes?level=${result.poverty_level}`)}
        className="btn btn--primary btn--lg btn--block"
      >
        📋 View Recommended Schemes →
      </button>
    </div>
  )
}