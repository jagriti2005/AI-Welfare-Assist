import { useState } from 'react'

const LEVEL_CFG = {
  Extreme: {
    color: '#f87171', bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.35)',
    emoji: '🚨',
    msg: 'Immediate assistance is recommended. The schemes below are matched specifically to your profile.',
  },
  High: {
    color: '#fb923c', bg: 'rgba(251,146,60,0.12)', border: 'rgba(251,146,60,0.35)',
    emoji: '⚠️',
    msg: 'Several welfare schemes are available to support your household. Check your matches below.',
  },
  Medium: {
    color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.35)',
    emoji: '📊',
    msg: 'Targeted government schemes can improve your financial stability. See your matches below.',
  },
  Low: {
    color: '#4ade80', bg: 'rgba(74,222,128,0.12)', border: 'rgba(74,222,128,0.32)',
    emoji: '✅',
    msg: 'You are in a relatively stable position. Savings and insurance schemes are recommended.',
  },
}

// ── Category badge colours ──────────────────────────────────────────────────
const CAT_COLOR = {
  'Employment':       { bg:'rgba(99,102,241,0.12)',  color:'#a5b4fc' },
  'Financial Inclusion':{ bg:'rgba(79,142,247,0.12)', color:'#7eb8ff' },
  'Food Security':    { bg:'rgba(251,191,36,0.12)',  color:'#fbbf24' },
  'Housing':          { bg:'rgba(251,146,60,0.12)',  color:'#fb923c' },
  'Health':           { bg:'rgba(248,113,113,0.12)', color:'#f87171' },
  'Agriculture':      { bg:'rgba(74,222,128,0.12)',  color:'#4ade80' },
  'Social Security':  { bg:'rgba(192,132,252,0.12)', color:'#c084fc' },
  'Entrepreneurship': { bg:'rgba(251,191,36,0.12)',  color:'#fbbf24' },
  'Skill Development':{ bg:'rgba(56,189,248,0.12)',  color:'#38bdf8' },
  'Insurance':        { bg:'rgba(52,211,153,0.12)',  color:'#34d399' },
  'Savings':          { bg:'rgba(251,146,60,0.12)',  color:'#fb923c' },
  'Clean Energy':     { bg:'rgba(74,222,128,0.12)',  color:'#4ade80' },
  'Education':        { bg:'rgba(99,102,241,0.12)',  color:'#a5b4fc' },
}

function SchemeCard({ scheme, index, levelColor, levelBg, levelBorder, levelLabel }) {
  const [expanded, setExpanded] = useState(false)
  const cat = CAT_COLOR[scheme.category] || { bg:'rgba(79,142,247,0.12)', color:'#7eb8ff' }

  return (
    <div
      className="scheme-card"
      style={{ borderLeft:`3px solid ${levelColor}`, marginTop: index === 0 ? 0 : '16px' }}
    >
      {/* Top row */}
      <div className="scheme-card__top">
        <div style={{ flex:1 }}>
          {/* Level + Category badges */}
          <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'10px' }}>
            <span
              className="scheme-card__badge"
              style={{ color:levelColor, background:levelBg, borderColor:levelBorder }}
            >
              {levelLabel}
            </span>
            <span
              className="scheme-card__badge"
              style={{ color:cat.color, background:cat.bg, borderColor:cat.bg }}
            >
              {scheme.category}
            </span>
          </div>
          <p className="scheme-card__name">{scheme.name}</p>
        </div>
        <span className="scheme-card__num">{index + 1}</span>
      </div>

      {/* Description */}
      <p className="scheme-card__desc">{scheme.description}</p>

      {/* Benefit + Eligibility */}
      <div className="scheme-card__info-row">
        <div
          className="info-box"
          style={{ background:'rgba(74,222,128,0.08)', border:'1px solid rgba(74,222,128,0.22)' }}
        >
          <p className="info-box__label" style={{ color:'#4ade80' }}>💰 Benefit</p>
          <p className="info-box__text">{scheme.benefit}</p>
        </div>
        <div
          className="info-box"
          style={{ background:'rgba(79,142,247,0.08)', border:'1px solid rgba(79,142,247,0.22)' }}
        >
          <p className="info-box__label" style={{ color:'#7eb8ff' }}>✅ Eligibility</p>
          <p className="info-box__text">{scheme.eligibility}</p>
        </div>
      </div>

      {/* Steps toggle */}
      <button
        className="scheme-card__toggle"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? '▲ Hide application steps' : '▼ How to apply — step by step'}
      </button>

      {expanded && (
        <div className="steps-box">
          <p className="steps-box__head">Application Process</p>
          {scheme.process.map((step, j) => (
            <div key={j} className="step-row">
              <span className="step-row__num">{j + 1}</span>
              <span className="step-row__text">{step}</span>
            </div>
          ))}
        </div>
      )}

      {/* Apply button */}
      <button
        onClick={() => window.open(scheme.apply_link, '_blank')}
        className="btn btn--primary btn--block"
        style={{ fontSize:'14.5px' }}
      >
        Apply Now — Official Government Website →
      </button>
    </div>
  )
}

// ── Main ResultCard component ────────────────────────────────────────────────
export default function ResultCard({ result }) {
  const c = LEVEL_CFG[result.poverty_level] || LEVEL_CFG['Medium']
  const schemes = result.schemes || []

  return (
    <div style={{ marginTop:'30px' }}>

      {/* ── Prediction summary box ── */}
      <div
        className="result-card"
        style={{
          borderColor: c.border,
          borderLeftColor: c.color,
          borderLeftWidth: '3px',
          marginBottom: '28px',
        }}
      >
        <span className="result-card__emoji">{c.emoji}</span>
        <span className="result-card__eyebrow">AI Prediction Result</span>

        <div>
          <span
            className="result-card__level"
            style={{ color:c.color, background:c.bg, borderColor:c.border }}
          >
            {result.poverty_level} Poverty Level
          </span>
        </div>

        <p className="result-card__msg">{c.msg}</p>

        {/* Confidence bar */}
        <div className="conf-box">
          <div className="conf-box__row">
            <span className="conf-box__lbl">Model Confidence</span>
            <span className="conf-box__pct">{result.confidence}%</span>
          </div>
          <div className="conf-box__track">
            <div
              className="conf-box__fill"
              style={{ width:`${result.confidence}%`, background:c.color }}
            />
          </div>
        </div>

        {/* Schemes count badge */}
        <div style={{
          display:'inline-flex', alignItems:'center', gap:'8px',
          background:'rgba(79,142,247,0.10)',
          border:'1px solid rgba(79,142,247,0.25)',
          borderRadius:'10px', padding:'10px 18px',
        }}>
          <span style={{ fontSize:'18px' }}>📋</span>
          <span style={{ fontSize:'14px', color:'#7eb8ff', fontWeight:600 }}>
            {schemes.length} government scheme{schemes.length !== 1 ? 's' : ''} matched to your profile
          </span>
        </div>
      </div>

      {/* ── Matched schemes heading ── */}
      {schemes.length > 0 && (
        <>
          <div style={{ marginBottom:'20px' }}>
            <p className="t-eyebrow" style={{ marginBottom:'8px' }}>Your Matched Schemes</p>
            <h2 className="t-display-lg" style={{ marginBottom:'6px' }}>
              Schemes You Qualify For
            </h2>
            <p className="t-body-sm">
              These {schemes.length} schemes were matched based on your age, income, household
              type, location and other details you provided.
            </p>
          </div>

          {/* ── Scheme cards ── */}
          {schemes.map((scheme, i) => (
            <SchemeCard
              key={i}
              scheme={scheme}
              index={i}
              levelColor={c.color}
              levelBg={c.bg}
              levelBorder={c.border}
              levelLabel={result.poverty_level + ' Priority'}
            />
          ))}

          {/* ── Footer hint ── */}
          <div className="hint-card" style={{ marginTop:'24px' }}>
            <p className="t-muted" style={{ marginBottom:'5px' }}>Need help applying?</p>
            <p style={{
              fontSize:'15px', fontWeight:600,
              color:'var(--text-primary)',
              fontFamily:'var(--font-display)',
            }}>
              Visit your nearest Common Service Centre (CSC) or Gram Panchayat Office
            </p>
          </div>
        </>
      )}
    </div>
  )
}