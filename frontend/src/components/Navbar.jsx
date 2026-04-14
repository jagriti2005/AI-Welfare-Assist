import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation()

  const links = [
    { path: '/', label: 'Home' },
    { path: '/predict', label: '🔮 Predict' },
    { path: '/schemes', label: '📋 Schemes' },
    { path: '/dashboard', label: '📊 Dashboard' },
  ]

  return (
    <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🤝</span>
        <span className="text-xl font-bold text-blue-400">AI Welfare Assist</span>
        <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">Beta</span>
      </div>
      <div className="flex gap-6">
        {links.map(link => (
          <Link
            key={link.path}
            to={link.path}
            className={`text-sm font-medium transition-colors duration-200 ${
              location.pathname === link.path
                ? 'text-blue-400 border-b-2 border-blue-400 pb-1'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}