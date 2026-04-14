import { useState } from 'react'
import axios from 'axios'
import ResultCard from '../components/ResultCard'

const states = ['UP', 'Bihar', 'MH', 'Delhi', 'Rajasthan', 'MP', 'Karnataka', 'TN', 'Gujarat', 'Kerala', 'Jharkhand', 'Odisha', 'AP']

export default function Predict() {
  const [form, setForm] = useState({
    age: '', income_monthly: '', family_size: '',
    education_level: '0', employment_status: '0',
    land_ownership: '0', house_type: '0',
    access_to_electricity: '1', access_to_water: '1', state: 'UP'
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await axios.post('http://localhost:5000/api/predict', form)
      setResult(res.data)
    } catch (err) {
      setError('Prediction failed. Make sure backend is running.')
    }
    setLoading(false)
  }

  const fields = [
    { label: 'Age', name: 'age', type: 'number', placeholder: 'e.g. 35' },
    { label: 'Monthly Income (₹)', name: 'income_monthly', type: 'number', placeholder: 'e.g. 5000' },
    { label: 'Family Size', name: 'family_size', type: 'number', placeholder: 'e.g. 4' },
  ]

  const selects = [
    { label: 'Education Level', name: 'education_level', options: [['0','No Education'],['1','Primary'],['2','Secondary'],['3','Graduate+']] },
    { label: 'Employment Status', name: 'employment_status', options: [['0','Unemployed'],['1','Employed']] },
    { label: 'Land Ownership', name: 'land_ownership', options: [['0','No Land'],['1','Owns Land']] },
    { label: 'House Type', name: 'house_type', options: [['0','Kutcha'],['1','Semi-Pucca'],['2','Pucca'],['3','Own Flat']] },
    { label: 'Access to Electricity', name: 'access_to_electricity', options: [['0','No'],['1','Yes']] },
    { label: 'Access to Water', name: 'access_to_water', options: [['0','No'],['1','Yes']] },
  ]

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white mb-3">🔮 Poverty Prediction</h1>
        <p className="text-slate-400">Fill in the details below to get AI-powered poverty assessment</p>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-xl">
        {/* Number inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {fields.map(f => (
            <div key={f.name}>
              <label className="block text-slate-300 text-sm font-medium mb-2">{f.label}</label>
              <input
                type={f.type}
                name={f.name}
                value={form[f.name]}
                onChange={handleChange}
                placeholder={f.placeholder}
                className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          ))}
        </div>

        {/* Select inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {selects.map(s => (
            <div key={s.name}>
              <label className="block text-slate-300 text-sm font-medium mb-2">{s.label}</label>
              <select
                name={s.name}
                value={form[s.name]}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                {s.options.map(([val, lbl]) => (
                  <option key={val} value={val}>{lbl}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* State select */}
        <div className="mb-8">
          <label className="block text-slate-300 text-sm font-medium mb-2">State</label>
          <select
            name="state"
            value={form.state}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
          >
            {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {error && <p className="text-red-400 mb-4 text-center">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 text-white font-bold py-4 rounded-xl text-lg transition-all duration-200 shadow-lg"
        >
          {loading ? '🔄 Analyzing...' : '🔮 Predict Poverty Level'}
        </button>
      </div>

      {result && <ResultCard result={result} form={form} />}
    </div>
  )
}