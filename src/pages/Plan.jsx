import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthModal from '../components/AuthModal'
import CircularText from '../components/CircularText'
import api from '../services/api'
import '../App.css'
import './Plan.css'

function Plan() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      setLoading(true)
      const response = await api.getPlans({ isActive: true })
      setPlans(response.plans || [])
    } catch (error) {
      console.error('Error fetching plans:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePlanSelect = (planId) => {
    if (!user) {
      setShowAuthModal(true)
      return
    }
    setSelectedPlan(planId)
    localStorage.setItem('featureme_planId', planId)
  }

  const handleContinue = () => {
    if (!user) {
      setShowAuthModal(true)
      return
    }
    if (selectedPlan) {
      // Store plan ID and navigate to checkout (plan is selected at the end)
      localStorage.setItem('featureme_planId', selectedPlan)
      navigate('/checkout')
    } else {
      alert('Please select a plan to continue')
    }
  }

  if (loading) {
    return (
      <div className="App">
        <main className="page-container plan-page">
          <div className="plan-page-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <CircularText
              text="FEATURE*ME*"
              onHover="speedUp"
              spinDuration={20}
              className="loading-circular-text"
            />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="App">
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      <main className="page-container plan-page">
        <div className="plan-page-content">
          <div className="plan-header-section">
            <h1 className="plan-main-title">
              <span className="gradient-magenta">Choose Your</span>{' '}
              <span className="gradient-blue">Plan</span>
            </h1>
            <p className="plan-subtitle">
              Select the perfect package for your billboard feature. All plans include premium locations and high-quality displays.
            </p>
          </div>

          <div className="plans-container">
            {plans.length === 0 ? (
              <div className="empty-state">
                <p>No plans available at the moment.</p>
              </div>
            ) : (
              plans.map((plan) => (
                <div 
                  key={plan.id} 
                  className={`plan-card ${selectedPlan === plan.id ? 'selected' : ''}`}
                  onClick={() => handlePlanSelect(plan.id)}
                >
                  <div className="plan-card-inner">
                    <div className="plan-title-section">
                      <h3 className="plan-name">{plan.name}</h3>
                      <div className="plan-price-section">
                        <span className="currency">₹</span>
                        <span className="price-value">
                          {typeof plan.price === 'number' ? plan.price.toLocaleString('en-IN') : plan.price}
                        </span>
                        {plan.name?.toLowerCase().includes('custom') && (
                          <span className="price-period"> onwards</span>
                        )}
                        {!plan.name?.toLowerCase().includes('custom') && plan.duration && (
                          <span className="price-period">
                            /{plan.duration} day{plan.duration > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      {plan.description && (
                        <p className="plan-description">{plan.description}</p>
                      )}
                    </div>

                    <div className="plan-features-section">
                      <ul className="features-list">
                        {plan.features && plan.features.map((feature, index) => (
                          <li key={index} className="feature-item">
                            <svg className="check-mark" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <defs>
                                <linearGradient id={`gradient-${plan.id}-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor="#ff00ff" />
                                  <stop offset="100%" stopColor="#00bfff" />
                                </linearGradient>
                              </defs>
                              <circle cx="12" cy="12" r="10" stroke={`url(#gradient-${plan.id}-${index})`} strokeWidth="2" fill="none"/>
                              <path d="M8 12l2 2 4-4" stroke={`url(#gradient-${plan.id}-${index})`} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                            </svg>
                            <span className="feature-text">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="plan-action-section">
                      <button 
                        className={`plan-cta-button ${selectedPlan === plan.id ? 'selected' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          handlePlanSelect(plan.id)
                        }}
                      >
                        <span>{selectedPlan === plan.id ? 'Selected' : 'Select Plan'}</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {selectedPlan && (
            <div className="action-buttons">
              <button className="btn btn-blue" onClick={handleContinue}>
                Continue to Payment
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => navigate('/upload')}
              >
                Back to Upload
              </button>
            </div>
          )}

          <div className="plan-footer-note">
            <p>💡 All plans include 24/7 customer support and premium billboard locations. Contact us for custom enterprise solutions.</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Plan
