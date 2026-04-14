import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import axios from "axios"

const levelConfig = {
  Extreme: { color: "text-red-400", bg: "bg-red-900/20", border: "border-red-800" },
  High: { color: "text-orange-400", bg: "bg-orange-900/20", border: "border-orange-800" },
  Medium: { color: "text-yellow-400", bg: "bg-yellow-900/20", border: "border-yellow-800" },
  Low: { color: "text-green-400", bg: "bg-green-900/20", border: "border-green-800" },
}

export default function Schemes() {
  const [searchParams] = useSearchParams()
  const level = searchParams.get("level") || "Medium"
  const [schemes, setSchemes] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)
  const cfg = levelConfig[level] || levelConfig["Medium"]

  useEffect(() => {
    axios.get("http://localhost:5000/api/schemes?level=" + level)
      .then(res => { setSchemes(res.data.schemes); setLoading(false) })
      .catch(() => setLoading(false))
  }, [level])

  const openLink = (url) => { window.open(url, "_blank") }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <div className="text-4xl mb-4">Loading...</div>
          <p className="text-slate-400">Fetching recommended schemes</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white mb-3">Recommended Schemes</h1>
        <div className={"inline-block px-6 py-2 rounded-full border text-sm font-semibold " + cfg.bg + " " + cfg.border + " " + cfg.color}>
          {level} Poverty Level
        </div>
        <p className="text-slate-400 mt-3">{schemes.length} schemes found for your profile</p>
      </div>

      <div className="space-y-6">
        {schemes.map((scheme, i) => (
          <div key={i} className="bg-slate-800 border border-slate-700 hover:border-blue-600 rounded-2xl p-6 transition-all duration-300 shadow-xl">

            <div className="flex justify-between items-start mb-4">
              <div>
                <span className={"text-xs font-semibold px-3 py-1 rounded-full border " + cfg.bg + " " + cfg.border + " " + cfg.color}>
                  {level} Priority
                </span>
                <h3 className="text-xl font-bold text-white mt-2">{scheme.name}</h3>
              </div>
              <span className="text-3xl">
                {i === 0 ? "1" : i === 1 ? "2" : "3"}
              </span>
            </div>

            <p className="text-slate-300 mb-4">{scheme.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div className="bg-green-900/20 border border-green-800 rounded-xl px-4 py-3">
                <p className="text-green-400 text-xs font-semibold mb-1">BENEFIT</p>
                <p className="text-white text-sm">{scheme.benefit}</p>
              </div>
              <div className="bg-blue-900/20 border border-blue-800 rounded-xl px-4 py-3">
                <p className="text-blue-400 text-xs font-semibold mb-1">ELIGIBILITY</p>
                <p className="text-white text-sm">{scheme.eligibility}</p>
              </div>
            </div>

            <button
              onClick={() => setExpanded(expanded === i ? null : i)}
              className="text-blue-400 text-sm font-medium mb-4 hover:text-blue-300 flex items-center gap-2"
            >
              {expanded === i ? "Hide Steps" : "How to Apply - Step by Step"}
            </button>

            {expanded === i && (
              <div className="bg-slate-900/60 rounded-xl p-4 mb-4 border border-slate-700">
                <p className="text-white font-semibold mb-3 text-sm">Application Process:</p>
                <ol className="space-y-3">
                  {scheme.process.map((step, j) => (
                    <li key={j} className="flex gap-3 text-slate-300 text-sm">
                      <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        {j + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <button
              onClick={() => openLink(scheme.apply_link)}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all duration-200 text-sm"
            >
              Apply Now - Official Website
            </button>

          </div>
        ))}
      </div>

      <div className="mt-10 bg-slate-800 border border-slate-700 rounded-2xl p-6 text-center">
        <p className="text-slate-400 text-sm">Need more help? Contact your nearest</p>
        <p className="text-white font-semibold mt-1">Common Service Centre (CSC) or Gram Panchayat Office</p>
      </div>
    </div>
  )
}
