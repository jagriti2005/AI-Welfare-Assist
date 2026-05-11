import { useState } from 'react'
import axios from 'axios'
import ResultCard from '../components/ResultCard'

const STATES = [
  'UP', 'Bihar', 'MH', 'Delhi', 'Rajasthan', 'MP',
  'Karnataka', 'TN', 'Gujarat', 'Kerala', 'Jharkhand', 'Odisha', 'AP',
]

const INIT_FORM = {
  age: '', income_monthly: '', family_size: '',
  education_level: '0', employment_status: '0',
  land_ownership: '0', house_type: '0',
  access_to_electricity: '1', access_to_water: '1',
  state: 'UP',
}

export default function Predict() {
  const [form,       setForm]       = useState(INIT_FORM)
  const [result,     setResult]     = useState(null)
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState('')
  const [fieldErrors,setFieldErrors]= useState({})

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
    // clear field error on change
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: '' })
    }
  }

  // ── Validate all required fields before submit ──────────────────────────
  const validate = () => {
    const errs = {}
    const age = parseInt(form.age)
    const inc = parseInt(form.income_monthly)
    const fam = parseInt(form.family_size)

    if (!form.age || isNaN(age) || age < 1 || age > 120)
      errs.age = 'Enter a valid age (1–120)'
    if (!form.income_monthly || isNaN(inc) || inc < 0)
      errs.income_monthly = 'Enter a valid monthly income (₹0 or above)'
    if (!form.family_size || isNaN(fam) || fam < 1 || fam > 30)
      errs.family_size = 'Enter family size (1–30)'

    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await axios.post('http://localhost:5000/api/predict', form)
      if (res.data.status === 'success') {
        setResult(res.data)
        // smooth scroll to result
        setTimeout(() => {
          document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      } else {
        setError(res.data.error || 'Prediction failed. Please try again.')
      }
    } catch (err) {
      const msg = err.response?.data?.error
      setError(msg || 'Cannot connect to backend. Make sure Flask is running on port 5000.')
    }
    setLoading(false)
  }

  const numberFields = [
    { label: 'Age',               name: 'age',            placeholder: 'e.g. 35'   },
    { label: 'Monthly Income (₹)',name: 'income_monthly', placeholder: 'e.g. 5000' },
    { label: 'Family Size',       name: 'family_size',    placeholder: 'e.g. 4'    },
  ]

  const selectFields = [
    {
      label: 'Education Level', name: 'education_level',
      options: [['0','No Education'],['1','Primary School'],['2','Secondary / 10th'],['3','Graduate or above']],
    },
    {
      label: 'Employment Status', name: 'employment_status',
      options: [['0','Unemployed'],['1','Employed / Self-employed']],
    },
    {
      label: 'Land Ownership', name: 'land_ownership',
      options: [['0','Does not own land'],['1','Owns agricultural land']],
    },
    {
      label: 'House Type', name: 'house_type',
      options: [['0','Kutcha (mud/thatched)'],['1','Semi-Pucca'],['2','Pucca (brick/concrete)'],['3','Own Flat / Urban']],
    },
    {
      label: 'Electricity Access', name: 'access_to_electricity',
      options: [['0','No electricity'],['1','Has electricity']],
    },
    {
      label: 'Water Access', name: 'access_to_water',
      options: [['0','No piped water'],['1','Has piped water']],
    },
  ]

  return (
    <div className="page-wrap">

      {/* ── Page Header ── */}
      <div className="page-header">
        <div className="container--md">
          <p className="t-eyebrow">AI Assessment</p>
          <h1 className="t-display-lg" style={{ marginTop:'10px', marginBottom:'8px' }}>
            Poverty Prediction
          </h1>
          <p className="t-body-sm">
            Fill in the details below — our AI model will predict your poverty level
            and instantly match you to government schemes you qualify for.
          </p>
        </div>
      </div>

      <div className="container--md" style={{ paddingTop:'40px' }}>
        <div className="form-card">

          {/* ── Basic Info ── */}
          <div className="form-section">
            <span className="form-section__head">Basic Information</span>
            <div className="form-grid-3">
              {numberFields.map(f => (
                <div key={f.name}>
                  <label className="field-label">{f.label}</label>
                  <input
                    type="number"
                    name={f.name}
                    value={form[f.name]}
                    onChange={handleChange}
                    placeholder={f.placeholder}
                    className="field-input"
                    style={fieldErrors[f.name] ? { borderColor:'rgba(248,113,113,0.7)' } : {}}
                  />
                  {fieldErrors[f.name] && (
                    <p style={{ fontSize:'12px', color:'#f87171', marginTop:'5px' }}>
                      {fieldErrors[f.name]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── Household Details ── */}
          <div className="form-section">
            <span className="form-section__head">Household Details</span>
            <div className="form-grid-3">
              {selectFields.map(s => (
                <div key={s.name}>
                  <label className="field-label">{s.label}</label>
                  <select
                    name={s.name}
                    value={form[s.name]}
                    onChange={handleChange}
                    className="field-select"
                  >
                    {s.options.map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* ── Location ── */}
          <div className="form-section" style={{ marginBottom:'32px' }}>
            <span className="form-section__head">Location</span>
            <div style={{ maxWidth:'230px' }}>
              <label className="field-label">State</label>
              <select
                name="state"
                value={form.state}
                onChange={handleChange}
                className="field-select"
              >
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {error && (
            <div className="form-error">⚠️ {error}</div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn btn--primary btn--lg btn--block"
          >
            {loading ? '🔄 Analysing your profile...' : '🔮 Predict My Poverty Level'}
          </button>

          <p style={{ textAlign:'center', fontSize:'12px', color:'var(--text-faint)', marginTop:'14px' }}>
            Your data is not stored. This assessment is for informational purposes only.
          </p>
        </div>

        {/* ── Result appears below form ── */}
        <div id="result-section">
          {result && <ResultCard result={result} />}
        </div>
      </div>
    </div>
  )
}