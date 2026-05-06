import { Link } from 'react-router-dom'

export default function Home() {
  const stats = [
    { label: 'People in Poverty', value: '228M+', icon: '👥' },
    { label: 'Govt Schemes', value: '50+', icon: '📋' },
    { label: 'States Covered', value: '28', icon: '🗺️' },
    { label: 'Prediction Accuracy', value: '95%+', icon: '🎯' },
  ]

  const features = [
    {
      icon: '✨', title: 'Poverty Prediction',
      desc: 'AI-powered assessment using 10+ socioeconomic factors to accurately determine poverty level.',
      iconBg: '#1e1b4b',
    },
    {
      icon: '📋', title: 'Scheme Recommendation',
      desc: 'Instantly get personalised government scheme matches based on your unique household profile.',
      iconBg: '#0c2340',
    },
    {
      icon: '🔗', title: 'Direct Apply Links',
      desc: 'One-click access to official portals with step-by-step application guidance.',
      iconBg: '#0d2b1e',
    },
    {
      icon: '📊', title: 'Live Dashboard',
      desc: 'Visual analytics showing poverty distribution and scheme coverage across India.',
      iconBg: '#2c1a04',
    },
  ]

  const steps = [
    { num: '01', title: 'Fill the form', desc: 'Enter your socioeconomic details — age, income, location and household info.' },
    { num: '02', title: 'AI analyses', desc: 'Our ML model processes 10+ factors and predicts your poverty level in seconds.' },
    { num: '03', title: 'Get schemes', desc: 'Receive a personalised list of government schemes you are eligible for.' },
  ]

  return (
    <div className="page-wrap">

      {/* ── Hero ── */}
      <div className="hero">
        <div className="hero__glow-a" />
        <div className="hero__glow-b" />

        <div className="hero__inner">
          <div className="hero__badge anim-1">
            <span className="hero__badge-dot" />
            AI Powered &nbsp;·&nbsp; Real Government Data
          </div>

          <h1 className="t-display-xl hero__title anim-2">
            Predict Poverty.<br />
            <span className="hero__title-accent">Recommend Solutions.</span>
          </h1>

          <p className="hero__subtitle anim-3">
            AI-driven platform that predicts poverty levels and connects citizens with the right government welfare schemes instantly.
          </p>

          <div className="hero__cta-row anim-4">
            <Link to="/predict" className="btn btn--primary btn--lg">
              🔮 Start Prediction
            </Link>
            <Link to="/dashboard" className="btn btn--ghost btn--lg">
              📊 View Dashboard
            </Link>
          </div>

          {/* Stats strip anchored to hero bottom */}
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
      <section style={{ padding: '80px 0', background: 'var(--bg-1)' }}>
        <div className="container--md">
          <div className="section-head">
            <p className="t-eyebrow">Platform Features</p>
            <h2 className="t-display-lg">What AI Welfare Assist does</h2>
            <p className="section-head__sub">
              Four powerful tools to bridge citizens with welfare they deserve.
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
      <section style={{ padding: '80px 0', background: 'var(--bg-0)' }}>
        <div className="container--md">
          <div className="section-head">
            <p className="t-eyebrow">How It Works</p>
            <h2 className="t-display-lg">Three simple steps</h2>
            <p className="section-head__sub">
              From form to personalised schemes in under 2 minutes.
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

      {/* ── CTA ── */}
      <div className="cta-section">
        <h2 className="t-display-lg" style={{ marginBottom: '14px' }}>
          Ready to find your benefits?
        </h2>
        <p className="t-body" style={{ marginBottom: '36px' }}>
          Takes less than 2 minutes. No documents needed to get started.
        </p>
        <Link to="/predict" className="btn btn--primary btn--xl">
          🔮 Get Started Free →
        </Link>
      </div>

    </div>
  )
}