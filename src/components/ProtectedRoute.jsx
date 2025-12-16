import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import CircularText from './CircularText'
import './ProtectedRoute.css'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      setShowModal(true)
    }
  }, [user, loading])

  const handleClose = () => {
    setShowModal(false)
    navigate('/')
  }

  const handleSignIn = () => {
    navigate('/signin')
    setShowModal(false)
  }

  const handleSignUp = () => {
    navigate('/signup')
    setShowModal(false)
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularText
          text="FEATURE*ME*"
          onHover="speedUp"
          spinDuration={20}
          className="loading-circular-text"
        />
      </div>
    )
  }

  if (!user) {
    return (
      <>
        {showModal && (
          <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={handleClose}>×</button>
              <h2>Sign In Required</h2>
              <p>You need to sign in to access this page.</p>
              <div className="modal-buttons">
                <button className="btn btn-blue" onClick={handleSignIn}>
                  Sign In
                </button>
                <button className="btn btn-purple" onClick={handleSignUp}>
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  return children
}

export default ProtectedRoute

