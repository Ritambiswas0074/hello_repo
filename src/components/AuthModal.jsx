import { useNavigate } from 'react-router-dom'
import './AuthModal.css'

function AuthModal({ onClose }) {
  const navigate = useNavigate()

  const handleSignIn = () => {
    navigate('/signin')
    onClose()
  }

  const handleSignUp = () => {
    navigate('/signup')
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>Sign In Required</h2>
        <p>You need to sign in to continue with this action.</p>
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
  )
}

export default AuthModal

