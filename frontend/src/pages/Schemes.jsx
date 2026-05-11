import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const LEVEL_CFG = {
  Extreme: { color:'#f87171', bg:'rgba(248,113,113,0.12)', border:'rgba(248,113,113,0.32)', label:'Extreme Priority' },
  High:    { color:'#fb923c', bg:'rgba(251,146,60,0.12)',  border:'rgba(251,146,60,0.32)',  label:'High Priority'    },
  Medium:  { color:'#fbbf24', bg:'rgba(251,191,36,0.12)',  border:'rgba(251,191,36,0.32)',  label:'Medium Priority'  },
  Low:     { color:'#4ade80', bg:'rgba(74,222,128,0.12)',  border:'rgba(74,222,128,0.28)',  label:'Low Priority'     },
}

const CAT_COLOR = {
  'Employment':         { bg:'rgba(99,102,241,0.12)',  color:'#a5b4fc' },
  'Financial Inclusion':{ bg:'rgba(79,142,247,0.12)',  color:'#7eb8ff' },
  'Food Security':      { bg:'rgba(251,191,36,0.12)',  color:'#fbbf24' },
  'Housing':            { bg:'rgba(251,146,60,0.12)',  color:'#fb923c' },
  'Health':             { bg:'rgba(248,113,113,0.12)', color:'#f87171' },
  'Agriculture':        { bg:'rgba(74,222,128,0.12)',  color:'#4ade80' },
  'Social Security':    { bg:'rgba(192,132,252,0.12)', color:'#c084fc' },
  'Entrepreneurship':   { bg:'rgba(251,191,36,0.12)',  color:'#fbbf24' },
  'Skill Development':  { bg:'rgba(56,189,248,0.12)',  color:'#38bdf8' },
  'Insurance':          { bg:'rgba(52,211,153,0.12)',  color:'#34d399' },
  'Savings':            { bg:'rgba(251,146,60,0.12)',  color:'#fb923c' },
  'Clean Energy':       { bg:'rgba(74,222,128,0.12)',  color:'#4ade80' },
  'Education':          { bg:'rgba(99,102,241,0.12)',  color:'#a5b4fc' },
}

export default function Schemes() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const level    = searchParams.get('level') || 'Medium'
  const [schemes,  setSchemes]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')
  const [expanded, setExpanded] = useState(null)
  const c = LEVEL_CFG[level] || LEVEL_CFG['Medium']

  useEffect(() => {
    setLoading(true)
    setError('')
    setExpanded(null)
    axios.get(`http://localhost:5000/api/schemes?level=${level}`)
      .then(res => { setSchemes(res.data.schemes || []); setLoading(false) })
      .catch(() => {
        setError('Could not load schemes. Make sure the backend is running on port 5000.')
        setLoading(false)
      })
  }, [level])

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'60vh', flexDirection:'column', gap:'16px' }}>
      <span style={{ fontSize:'36px' }}>⏳</span>
      <p className="t-body-sm">Loading schemes…</p>
    </div>
  )

  if (error) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'60vh', flexDirection:'column', gap:'16px', padding:'2rem' }}>
      <span style={{ fontSize:'36px' }}>⚠️</span>
      <p style={{ fontSize:'15px', color:'#f87171', textAlign:'center' }}>{error}</p>
      <p className="t-body-sm" style={{ textAlign:'center' }}>
        Start Flask backend: <code style={{ color:'#7eb8ff', background:'rgba(79,142,247,0.1)', padding:'2px 8px', borderRadius:'4px' }}>python app.py</code>
      </p>
    </div>
  )

  return (
    <div className="page-wrap">

      {/* Header */}
      <div className="page-header">
        <div className="container--md">
          <p className="t-eyebrow">Welfare Schemes</p>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'14px', marginTop:'10px' }}>
            <div>
              <h1 className="t-display-lg" style={{ marginBottom:'7px' }}>Recommended Schemes</h1>
              <p className="t-body-sm">{schemes.length} schemes for <strong style={{ color:'var(--text-primary)' }}>{level} Poverty Level</strong></p>
            </div>
            <span style={{
              padding:'7px 20px', borderRadius:'20px',
              background:c.bg, border:`1px solid ${c.border}`,
              color:c.color, fontSize:'13.5px', fontWeight:700,
              fontFamily:'var(--font-display)',
            }}>
              {c.label}
            </span>
          </div>
        </div>
      </div>

      <div className="container--md" style={{ paddingTop:'36px' }}>

        {/* Level filter tabs — React Router navigate, no full reload */}
        <div style={{ display:'flex', gap:'8px', marginBottom:'28px', flexWrap:'wrap' }}>
          {['Extreme','High','Medium','Low'].map(lvl => {
            const cfg    = LEVEL_CFG[lvl]
            const active = lvl === level
            return (
              <button
                key={lvl}
                onClick={() => navigate(`/schemes?level=${lvl}`)}
                style={{
                  padding:'7px 18px', borderRadius:'20px',
                  fontSize:'13px', fontWeight:600,
                  cursor:'pointer',
                  background: active ? cfg.bg : 'var(--bg-card)',
                  border: `1px solid ${active ? cfg.border : 'var(--border-card)'}`,
                  color: active ? cfg.color : 'var(--text-muted)',
                  transition:'all .15s',
                  fontFamily:'var(--font-display)',
                }}
              >
                {lvl} Priority
              </button>
            )
          })}
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:'18px' }}>
          {schemes.map((scheme, i) => {
            const cat = CAT_COLOR[scheme.category] || { bg:'rgba(79,142,247,0.12)', color:'#7eb8ff' }
            return (
              <div key={i} className="scheme-card" style={{ borderLeft:`3px solid ${c.color}` }}>

                {/* Top */}
                <div className="scheme-card__top">
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'10px' }}>
                      <span className="scheme-card__badge"
                        style={{ color:c.color, background:c.bg, borderColor:c.border }}>
                        {c.label}
                      </span>
                      <span className="scheme-card__badge"
                        style={{ color:cat.color, background:cat.bg, borderColor:cat.bg }}>
                        {scheme.category}
                      </span>
                    </div>
                    <p className="scheme-card__name">{scheme.name}</p>
                  </div>
                  <span className="scheme-card__num">{i + 1}</span>
                </div>

                <p className="scheme-card__desc">{scheme.description}</p>

                {/* Benefit + Eligibility */}
                <div className="scheme-card__info-row">
                  <div className="info-box"
                    style={{ background:'rgba(74,222,128,0.08)', border:'1px solid rgba(74,222,128,0.22)' }}>
                    <p className="info-box__label" style={{ color:'#4ade80' }}>💰 Benefit</p>
                    <p className="info-box__text">{scheme.benefit}</p>
                  </div>
                  <div className="info-box"
                    style={{ background:'rgba(79,142,247,0.08)', border:'1px solid rgba(79,142,247,0.22)' }}>
                    <p className="info-box__label" style={{ color:'#7eb8ff' }}>✅ Eligibility</p>
                    <p className="info-box__text">{scheme.eligibility}</p>
                  </div>
                </div>

                {/* Steps toggle */}
                <button className="scheme-card__toggle"
                  onClick={() => setExpanded(expanded === i ? null : i)}>
                  {expanded === i ? '▲ Hide application steps' : '▼ How to apply — step by step'}
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
                  style={{ fontSize:'14.5px' }}
                >
                  Apply Now — Official Government Website →
                </button>
              </div>
            )
          })}
        </div>

        <div className="hint-card">
          <p className="t-muted" style={{ marginBottom:'5px' }}>Need help applying in person?</p>
          <p style={{ fontSize:'15px', fontWeight:600, color:'var(--text-primary)', fontFamily:'var(--font-display)' }}>
            Visit your nearest Common Service Centre (CSC) or Gram Panchayat Office
          </p>
        </div>
      </div>
    </div>
  )
}