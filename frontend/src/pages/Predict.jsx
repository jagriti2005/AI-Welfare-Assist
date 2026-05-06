import { useState } from 'react'
import axios from 'axios'
import ResultCard from '../components/ResultCard'

const states = [
  'UP','Bihar','MH','Delhi','Rajasthan','MP',
  'Karnataka','TN','Gujarat','Kerala','Jharkhand','Odisha','AP',
]

export default function Predict() {
  const [form, setForm] = useState({
    age: '', income_monthly: '', family_size: '',
    education_level: '0', employment_status: '0',
    land_ownership: '0', house_type: '0',
    access_to_electricity: '1', access_to_water: '1',
    state: 'UP',
  })
  const [result, setResult]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
    setLoading(true); setError('')
    try {
      const res = await axios.post('http://localhost:5000/api/predict', form)
      setResult(res.data)
    } catch {
      setError('Prediction failed. Make sure the backend is running on port 5000.')
    }
    setLoading(false)
  }

  const numberFields = [
    { label: 'Age',              name: 'age',            placeholder: 'e.g. 35'   },
    { label: 'Monthly Income ₹', name: 'income_monthly', placeholder: 'e.g. 5000' },
    { label: 'Family Size',      name: 'family_size',    placeholder: 'e.g. 4'    },
  ]

  const selectFields = [
    { label: 'Education Level',    name: 'education_level',       options: [['0','No Education'],['1','Primary'],['2','Secondary'],['3','Graduate+']] },
    { label: 'Employment',         name: 'employment_status',     options: [['0','Unemployed'],['1','Employed']] },
    { label: 'Land Ownership',     name: 'land_ownership',        options: [['0','No Land'],['1','Owns Land']] },
    { label: 'House Type',         name: 'house_type',            options: [['0','Kutcha'],['1','Semi-Pucca'],['2','Pucca'],['3','Own Flat']] },
    { label: 'Electricity Access', name: 'access_to_electricity', options: [['0','No'],['1','Yes']] },
    { label: 'Water Access',       name: 'access_to_water',       options: [['0','No'],['1','Yes']] },
  ]

  return (
    <div className="page-wrap">

      {/* Header */}
      <div className="page-header">
        <div className="container--md">
          <p className="t-eyebrow" style={{ marginBottom: '10px' }}>AI Assessment</p>
          <h1 className="t-display-lg" style={{ marginBottom: '8px' }}>Poverty Prediction</h1>
          <p className="t-body-sm">Fill in the details below to get an AI-powered welfare assessment</p>
        </div>
      </div>

      <div className="container--md" style={{ paddingTop: '40px' }}>
        <div className="form-card">

          {/* Basic Info */}
          <div className="form-section">
            <span className="form-section__head">Basic Information</span>
            <div className="form-grid-3">
              {numberFields.map(f => (
                <div key={f.name}>
                  <label className="field-label">{f.label}</label>
                  <input
                    type="number" name={f.name}
                    value={form[f.name]} onChange={handleChange}
                    placeholder={f.placeholder}
                    className="field-input"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Household */}
          <div className="form-section">
            <span className="form-section__head">Household Details</span>
            <div className="form-grid-3">
              {selectFields.map(s => (
                <div key={s.name}>
                  <label className="field-label">{s.label}</label>
                  <select name={s.name} value={form[s.name]}
                    onChange={handleChange} className="field-select">
                    {s.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="form-section" style={{ marginBottom: '32px' }}>
            <span className="form-section__head">Location</span>
            <div style={{ maxWidth: '220px' }}>
              <label className="field-label">State</label>
              <select name="state" value={form.state}
                onChange={handleChange} className="field-select">
                {states.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {error && (
            <div className="form-error">
              ⚠️ {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn btn--primary btn--lg btn--block"
          >
            {loading ? '🔄 Analysing...' : '🔮 Predict Poverty Level'}
          </button>
        </div>

        {result && <ResultCard result={result} />}
      </div>
    </div>
  )
}