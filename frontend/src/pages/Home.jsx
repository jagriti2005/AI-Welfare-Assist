import { Link } from 'react-router-dom'

export default function Home() {
  const stats = [
    { label: 'People in Poverty',   value: '228M+',  icon: '👥' },
    { label: 'Govt Schemes',        value: '16',     icon: '📋' },
    { label: 'States Covered',      value: '28',     icon: '🗺️' },
    { label: 'Model Accuracy',      value: '99.7%',  icon: '🎯' },
  ]

  const features = [
    {
      icon: '✨', title: 'Poverty Prediction',
      desc: 'AI-powered assessment using 10+ socioeconomic factors to accurately determine your poverty level.',
      iconBg: 'rgba(99,102,241,0.18)',
    },
    {
      icon: '📋', title: 'Scheme Recommendation',
      desc: 'Instantly matched to the right government welfare schemes based on your real household profile.',
      iconBg: 'rgba(79,142,247,0.18)',
    },
    {
      icon: '🔗', title: 'Direct Apply Links',
      desc: 'One-click access to official government portals with clear step-by-step guidance.',
      iconBg: 'rgba(52,211,153,0.15)',
    },
    {
      icon: '📊', title: 'Live Dashboard',
      desc: 'Real NFHS-5 data showing poverty distribution across Indian states.',
      iconBg: 'rgba(251,191,36,0.14)',
    },
  ]

  const steps = [
    {
      num: '01', title: 'Fill the form',
      desc: 'Enter your socioeconomic details — age, income, location and household info.',
    },
    {
      num: '02', title: 'AI analyses',
      desc: 'Random Forest model trained on 12,000 households predicts your poverty level instantly.',
    },
    {
      num: '03', title: 'Get schemes',
      desc: 'Receive personalised government schemes matched to your exact profile — with apply links.',
    },
  ]

  return (
    <div className="page-wrap" style={{ paddingBottom: 0 }}>

      {/* ── Hero ── */}
      <div className="hero">
        <div className="hero__glow-a" />
        <div className="hero__glow-b" />

        <div className="hero__inner">
          <div className="hero__badge anim-1">
            <span className="hero__badge-dot" />
            AI Powered &nbsp;·&nbsp; Real Government Data &nbsp;·&nbsp; NFHS-5 Calibrated
          </div>

          <h1 className="t-display-xl hero__title anim-2">
            Predict Poverty.<br />
            <span className="hero__title-accent">Recommend Solutions.</span>
          </h1>

          <p className="hero__subtitle anim-3">
            AI-driven platform that predicts poverty levels and connects citizens with
            the right government welfare schemes — instantly and for free.
          </p>

          <div className="hero__cta-row anim-4">
            <Link to="/predict" className="btn btn--primary btn--lg">
              🔮 Start Prediction
            </Link>
            <Link to="/dashboard" className="btn btn--ghost btn--lg">
              📊 View Dashboard
            </Link>
          </div>

          <div className="stats-strip">
            {stats.map((s, i) => (
              <div key={i} className="stats-strip__cell">
                <span className="stats-strip__icon">{s.icon}</span>
                <span className="stats-strip__val">{s.value}</span>
                <span className="stats-strip__label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Features ── */}
      <section style={{ padding: '84px 0', background: 'var(--bg-surface)' }}>
        <div className="container--md">
          <div className="section-head">
            <p className="t-eyebrow">Platform Features</p>
            <h2 className="t-display-lg">What AI Welfare Assist does</h2>
            <p className="section-head__sub">
              Four powerful tools to bridge citizens with the welfare they deserve.
            </p>
          </div>
          <div className="feature-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-card__icon" style={{ background: f.iconBg }}>
                  {f.icon}
                </div>
                <div>
                  <p className="feature-card__title">{f.title}</p>
                  <p className="feature-card__desc">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ padding: '84px 0', background: 'var(--bg-base)' }}>
        <div className="container--md">
          <div className="section-head">
            <p className="t-eyebrow">How It Works</p>
            <h2 className="t-display-lg">Three simple steps</h2>
            <p className="section-head__sub">
              From form to personalised schemes in under 2 minutes — no documents needed.
            </p>
          </div>
          <div className="steps-row">
            {steps.map((s, i) => (
              <div key={i} className="step">
                <div className="step__num">{s.num}</div>
                <p className="step__title">{s.title}</p>
                <p className="step__desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Data credibility strip ── */}
      <section style={{
        background: 'var(--bg-surface)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '32px 28px',
      }}>
        <div className="container--md">
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'40px', flexWrap:'wrap' }}>
            {[
              { label: 'Training Dataset',    value: '12,000 households' },
              { label: 'Model Type',          value: 'Random Forest (300 trees)' },
              { label: 'Cross-Val Accuracy',  value: '99.53% ± 0.21%' },
              { label: 'Data Source',         value: 'NFHS-5 / NITI Aayog MPI' },
            ].map((item, i) => (
              <div key={i} style={{ textAlign:'center' }}>
                <p style={{ fontFamily:'var(--font-display)', fontSize:'16px', fontWeight:700, color:'#7eb8ff', marginBottom:'3px' }}>
                  {item.value}
                </p>
                <p style={{ fontSize:'11px', color:'var(--text-muted)', fontWeight:600, letterSpacing:'0.5px', textTransform:'uppercase' }}>
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="cta-section">
        <h2 className="t-display-lg" style={{ marginBottom:'16px' }}>
          Ready to find your benefits?
        </h2>
        <p className="t-body" style={{ marginBottom:'38px', color:'var(--text-secondary)' }}>
          Takes less than 2 minutes. No registration required.
        </p>
        <Link to="/predict" className="btn btn--primary btn--xl">
          🔮 Get Started Free →
        </Link>
      </div>

    </div>
  )
}