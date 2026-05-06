code = '''import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import axios from "axios"

export default function Schemes() {
  const [searchParams] = useSearchParams()
  const level = searchParams.get("level") || "Medium"
  const [schemes, setSchemes] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    axios.get("http://localhost:5000/api/schemes?level=" + level)
      .then(res => {
        setSchemes(res.data.schemes)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
  }, [level])

  if (loading) {
    return (
      <div className="text-center text-slate-400 py-20">
        Loading schemes...
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white mb-3">Recommended Schemes</h1>
        <p className="text-slate-400">
          Poverty Level: <span className="text-blue-400 font-bold">{level}</span>
        </p>
      </div>

      <div className="space-y-6">
        {schemes.map((scheme, i) => (
          <div key={i} className="bg-slate-800 border border-slate-700 rounded-2xl p-6">

            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-bold text-white">{scheme.name}</h3>
              <span className="text-blue-400 text-xs border border-blue-700 px-3 py-1 rounded-full">
                {level} Priority
              </span>
            </div>

            <p className="text-slate-400 mb-3">{scheme.description}</p>

            <div className="bg-green-900/20 border border-green-800 rounded-xl px-4 py-2 mb-4 inline-block">
              <span className="text-green-400 font-medium">Benefit: {scheme.benefit}</span>
            </div>

            <p className="text-slate-500 text-sm mb-4">Eligibility: {scheme.eligibility}</p>

            <button
              onClick={() => setExpanded(expanded === i ? null : i)}
              className="text-blue-400 text-sm mb-4 block hover:text-blue-300"
            >
              {expanded === i ? "Hide Steps" : "How to Apply"}
            </button>

            {expanded === i && (
              <ol className="space-y-2 mb-4">
                {scheme.process.map((step, j) => (
                  <li key={j} className="flex gap-3 text-slate-300 text-sm">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0">
                      {j + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            )}

            
              href={scheme.apply_link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl inline-block"
            >
              Apply Now
            </a>

          </div>
        ))}
      </div>
    </div>
  )
}
'''

with open("frontend/src/pages/Schemes.jsx", "w", encoding="utf-8", newline="\n") as f:
    f.write(code)

print("Done! Schemes.jsx written successfully.")