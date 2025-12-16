import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import GooeyNav from './GooeyNav'
import './Header.css'

function Header() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSignOut = () => {
    signOut()
    navigate('/')
  }

  // Determine initial active index based on current route
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Locations', href: '/locations' },
    { label: 'About', href: '/about' },
    { label: 'Plan', href: '/plan' },
  ]

  const getInitialActiveIndex = () => {
    const index = navItems.findIndex(item => item.href === location.pathname)
    return index !== -1 ? index : 0
  }

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="brand">
          <svg 
            width="160" 
            height="88" 
            viewBox="0 0 200 110" 
            className="brand-logo"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff00ff" />
                <stop offset="50%" stopColor="#b84dff" />
                <stop offset="100%" stopColor="#00bfff" />
              </linearGradient>
              <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff00ff" />
                <stop offset="50%" stopColor="#b84dff" />
                <stop offset="100%" stopColor="#00bfff" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* FM Monogram Group - Centered and larger */}
            <g transform="translate(60, 10)">
              {/* F vertical stroke (also serves as M left stroke) */}
              <rect x="12" y="12" width="5" height="32" rx="1" fill="url(#brandGradient)" filter="url(#glow)"/>
              {/* F top horizontal stroke */}
              <rect x="12" y="12" width="16" height="5" rx="1" fill="url(#brandGradient)" filter="url(#glow)"/>
              {/* F middle horizontal stroke */}
              <rect x="12" y="26" width="14" height="5" rx="1" fill="url(#brandGradient)" filter="url(#glow)"/>
              {/* M right vertical stroke */}
              <rect x="44" y="12" width="5" height="32" rx="1" fill="url(#brandGradient)" filter="url(#glow)"/>
              {/* M - sharp pointed apex in center (more pronounced) */}
              <path d="M 17 12 L 30 28 L 17 28 Z" fill="url(#brandGradient)" filter="url(#glow)"/>
              <path d="M 30 28 L 44 12 L 44 28 Z" fill="url(#brandGradient)" filter="url(#glow)"/>
              
              {/* Rectangular frame/billboard outline - thicker and more prominent */}
              <rect 
                x="9" 
                y="9" 
                width="44" 
                height="38" 
                fill="none" 
                stroke="url(#brandGradient)" 
                strokeWidth="2.5" 
                rx="2"
                filter="url(#glow)"
              />
              
              {/* Glitch effect on right side - more detailed pixelated squares */}
              <g opacity="0.8">
                <rect x="56" y="14" width="3" height="3" fill="#00bfff" rx="0.5" filter="url(#glow)"/>
                <rect x="60" y="18" width="2.5" height="2.5" fill="#b84dff" rx="0.5" filter="url(#glow)"/>
                <rect x="57" y="22" width="3" height="3" fill="#ff00ff" rx="0.5" filter="url(#glow)"/>
                <rect x="61" y="26" width="2.5" height="2.5" fill="#00bfff" rx="0.5" filter="url(#glow)"/>
                <rect x="58" y="30" width="3" height="3" fill="#b84dff" rx="0.5" filter="url(#glow)"/>
                <rect x="62" y="34" width="2.5" height="2.5" fill="#ff00ff" rx="0.5" filter="url(#glow)"/>
                <line x1="55" y1="20" x2="64" y2="20" stroke="#00bfff" strokeWidth="1.5" filter="url(#glow)"/>
                <line x1="56" y1="28" x2="63" y2="28" stroke="#ff00ff" strokeWidth="1.5" filter="url(#glow)"/>
                <line x1="57" y1="36" x2="62" y2="36" stroke="#b84dff" strokeWidth="1.5" filter="url(#glow)"/>
              </g>
              
              {/* Top T-shaped supports - larger and more visible */}
              <rect x="16" y="6" width="3" height="4" fill="url(#brandGradient)" rx="0.5" filter="url(#glow)"/>
              <rect x="14.5" y="6" width="6" height="2" fill="url(#brandGradient)" rx="0.5" filter="url(#glow)"/>
              <rect x="40" y="6" width="3" height="4" fill="url(#brandGradient)" rx="0.5" filter="url(#glow)"/>
              <rect x="38.5" y="6" width="6" height="2" fill="url(#brandGradient)" rx="0.5" filter="url(#glow)"/>
              
              {/* Bottom T-shaped supports */}
              <rect x="16" y="50" width="3" height="4" fill="url(#brandGradient)" rx="0.5" filter="url(#glow)"/>
              <rect x="14.5" y="52" width="6" height="2" fill="url(#brandGradient)" rx="0.5" filter="url(#glow)"/>
              <rect x="40" y="50" width="3" height="4" fill="url(#brandGradient)" rx="0.5" filter="url(#glow)"/>
              <rect x="38.5" y="52" width="6" height="2" fill="url(#brandGradient)" rx="0.5" filter="url(#glow)"/>
            </g>
            
            {/* FeatureMe Text - larger and better positioned */}
            <text 
              x="100" 
              y="80" 
              fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif" 
              fontSize="20" 
              fontWeight="700" 
              textAnchor="middle"
              fill="#ffffff"
              letterSpacing="0.5px"
            >
              Feature
            </text>
            <text 
              x="100" 
              y="100" 
              fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif" 
              fontSize="20" 
              fontWeight="700" 
              textAnchor="middle"
              fill="url(#textGradient)"
              letterSpacing="0.5px"
            >
              Me
            </text>
          </svg>
        </Link>
        <GooeyNav
          items={navItems}
          particleCount={15}
          particleDistances={[90, 10]}
          particleR={100}
          initialActiveIndex={getInitialActiveIndex()}
          animationTime={600}
          timeVariance={300}
          colors={[1, 2, 3, 1, 2, 3, 1, 4]}
        />
        <div className="header-right">
          {user ? (
            <div className="user-menu">
              <Link to="/dashboard" className="user-name">
                Hi, {user.firstName || user.email?.split('@')[0] || 'User'}
              </Link>
              <button className="btn-signout btn-signout-icon" onClick={handleSignOut} title="Sign Out" aria-label="Sign Out">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.59L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" fill="currentColor"/>
                </svg>
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/signin" className="btn-auth-icon" title="Sign In" aria-label="Sign In">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
                </svg>
              </Link>
              <Link to="/signup" className="btn-auth-icon btn-auth-icon-primary" title="Sign Up" aria-label="Sign Up">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 12C17.21 12 19 10.21 19 8C19 5.79 17.21 4 15 4C12.79 4 11 5.79 11 8C11 10.21 12.79 12 15 12ZM15 14C12.33 14 7 15.34 7 18V20H23V18C23 15.34 17.67 14 15 14ZM5 13V10H3V13H0V15H3V18H5V15H8V13H5Z" fill="currentColor"/>
                </svg>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header

