import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation()

  const links = [
    { path: '/', label: 'Home' },
    { path: '/predict', label: 'Predict' },
    { path: '/schemes', label: 'Schemes' },
    { path: '/dashboard', label: 'Dashboard' },
  ]

  return (
    <nav className="navbar">
      <div className="navbar__brand">
        <span className="navbar__logo">🤝</span>
        <span className="navbar__name">AI Welfare Assist</span>
        <span className="navbar__beta">Beta</span>
      </div>

      <div className="navbar__links">
        {links.map(link => (
          <Link
            key={link.path}
            to={link.path}
            className={`navbar__link ${location.pathname === link.path ? 'navbar__link--active' : ''}`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}