import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'

const levelCfg = {
  Extreme: { color: '#ef4444', bg: 'rgba(239,68,68,0.10)', border: 'rgba(239,68,68,0.26)', label: 'Extreme Priority' },
  High:    { color: '#f97316', bg: 'rgba(249,115,22,0.10)', border: 'rgba(249,115,22,0.26)', label: 'High Priority' },
  Medium:  { color: '#f59e0b', bg: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.26)', label: 'Medium Priority' },
  Low:     { color: '#22c55e', bg: 'rgba(34,197,94,0.10)',  border: 'rgba(34,197,94,0.26)',  label: 'Low Priority' },
}

export default function Schemes() {
  const [searchParams] = useSearchParams()
  const level = searchParams.get('level') || 'Medium'
  const [schemes, setSchemes] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)
  const c = levelCfg[level] || levelCfg['Medium']

  useEffect(() => {
    axios.get('http://localhost:5000/api/schemes?level=' + level)
      .then(res => { setSchemes(res.data.schemes); setLoading(false) })
      .catch(() => setLoading(false))
  }, [level])

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'60vh', flexDirection:'column', gap:'12px' }}>
      <span style={{ fontSize:'30px' }}>⏳</span>
      <p className="t-body-sm">Fetching recommended schemes…</p>
    </div>
  )

  return (
    <div className="page-wrap">

      {/* Header */}
      <div className="page-header">
        <div className="container--md">
          <p className="t-eyebrow" style={{ marginBottom: '10px' }}>Welfare Schemes</p>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'12px' }}>
            <div>
              <h1 className="t-display-lg" style={{ marginBottom: '6px' }}>Recommended Schemes</h1>
              <p className="t-body-sm">{schemes.length} schemes matched your profile</p>
            </div>
            <span
              style={{
                padding: '6px 18px', borderRadius: '20px',
                background: c.bg, border: `1px solid ${c.border}`,
                color: c.color, fontSize: '13px', fontWeight: 700,
                fontFamily: 'var(--font-display)',
              }}
            >
              {c.label}
            </span>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="container--md" style={{ paddingTop: '36px' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
          {schemes.map((scheme, i) => (
            <div
              key={i}
              className="scheme-card"
              style={{ borderLeft: `3px solid ${c.color}` }}
            >
              {/* Top row */}
              <div className="scheme-card__top">
                <div>
                  <span
                    className="scheme-card__badge"
                    style={{ color: c.color, background: c.bg, borderColor: c.border }}
                  >
                    {c.label}
                  </span>
                  <p className="scheme-card__name">{scheme.name}</p>
                </div>
                <span className="scheme-card__num">{i + 1}</span>
              </div>

              <p className="scheme-card__desc">{scheme.description}</p>

              {/* Benefit + Eligibility */}
              <div className="scheme-card__info-row">
                <div className="info-box" style={{ background:'rgba(34,197,94,0.07)', border:'1px solid rgba(34,197,94,0.20)' }}>
                  <p className="info-box__label" style={{ color:'#22c55e' }}>Benefit</p>
                  <p className="info-box__text">{scheme.benefit}</p>
                </div>
                <div className="info-box" style={{ background:'rgba(96,165,250,0.07)', border:'1px solid rgba(96,165,250,0.20)' }}>
                  <p className="info-box__label" style={{ color:'var(--blue-bright)' }}>Eligibility</p>
                  <p className="info-box__text">{scheme.eligibility}</p>
                </div>
              </div>

              {/* Toggle steps */}
              <button
                className="scheme-card__toggle"
                onClick={() => setExpanded(expanded === i ? null : i)}
              >
                {expanded === i ? '▲ Hide steps' : '▼ How to apply — step by step'}
              </button>

              {expanded === i && (
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

              <button
                onClick={() => window.open(scheme.apply_link, '_blank')}
                className="btn btn--primary btn--block"
                style={{ fontSize:'14px' }}
              >
                Apply Now — Official Website →
              </button>
            </div>
          ))}
        </div>

        {/* Footer hint */}
        <div className="hint-card">
          <p className="t-caption" style={{ marginBottom:'4px' }}>Need more help?</p>
          <p style={{ fontSize:'15px', fontWeight:600, color:'var(--text-100)', fontFamily:'var(--font-display)' }}>
            Contact your nearest Common Service Centre (CSC) or Gram Panchayat Office
          </p>
        </div>
      </div>
    </div>
  )
}