import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthModal from '../components/AuthModal'
import api from '../services/api'
import '../App.css'
import './Checkout.css'

function Checkout() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [bookingData, setBookingData] = useState(null)
  const [paymentIntent, setPaymentIntent] = useState(null)
  const [error, setError] = useState('')
  const [showWhatsAppFallback, setShowWhatsAppFallback] = useState(false)
  const [whatsappLink, setWhatsappLink] = useState('')

  useEffect(() => {
    if (!user) {
      setShowAuthModal(true)
      return
    }

    // Check if all required data is available
    const locationId = localStorage.getItem('featureme_locationId')
    const scheduleId = localStorage.getItem('featureme_scheduleId')
    const mediaIds = JSON.parse(localStorage.getItem('featureme_mediaIds') || '[]')
    const planId = localStorage.getItem('featureme_planId')
    const templateId = localStorage.getItem('featureme_templateId')

    if (!locationId || !scheduleId || mediaIds.length === 0 || !planId || !templateId) {
      setError('Missing booking information. Please complete the booking flow.')
      if (!templateId) {
        setError('Please select a template first. Redirecting to template selection...')
        setTimeout(() => navigate('/template'), 2000)
      }
      return
    }

    // Fetch plan details for display
    fetchBookingDetails(locationId, scheduleId, mediaIds, planId, templateId)
  }, [user, navigate])

  const fetchBookingDetails = async (locationId, scheduleId, mediaIds, planId, templateId) => {
    try {
      const [locationRes, mediaRes, planRes, templateRes] = await Promise.all([
        api.getLocationById(locationId),
        api.getUserMedia(),
        api.getPlanById(planId),
        api.getTemplateById(templateId),
      ])

      // Get schedule date from localStorage
      const scheduleDate = localStorage.getItem('featureme_scheduleDate')

      // Find all media items that match the mediaIds
      const allMedia = mediaRes.media?.filter(m => mediaIds.includes(m.id)) || []
      
      // If no media found, fallback to first media (for backward compatibility)
      const media = allMedia.length > 0 ? allMedia : (mediaRes.media?.[0] ? [mediaRes.media[0]] : [])

      setBookingData({
        location: locationRes.location || locationRes,
        schedule: { date: scheduleDate },
        media: media, // Now an array of all media
        plan: planRes.plan || planRes,
        template: templateRes.template || templateRes,
      })
    } catch (error) {
      console.error('Error fetching booking details:', error)
      setError('Failed to load booking details')
    }
  }

  const handleCreateBooking = async () => {
    if (!user) {
      setShowAuthModal(true)
      return
    }

    const locationId = localStorage.getItem('featureme_locationId')
    const scheduleId = localStorage.getItem('featureme_scheduleId')
    const mediaIds = JSON.parse(localStorage.getItem('featureme_mediaIds') || '[]')
    const planId = localStorage.getItem('featureme_planId')
    const templateId = localStorage.getItem('featureme_templateId')

    if (!locationId || !scheduleId || mediaIds.length === 0 || !planId || !templateId) {
      setError('Missing booking information. Please complete all steps.')
      if (!templateId) {
        setError('Please select a template first. Redirecting to template selection...')
        setTimeout(() => navigate('/template'), 2000)
        return
      }
      return
    }

    setLoading(true)
    setError('')

    try {
      // Step 1: Create booking
      const bookingResponse = await api.createBooking({
        locationId,
        scheduleId,
        mediaId: mediaIds[0], // Use first media
        templateId,
        planId,
      })

      const bookingId = bookingResponse.booking.id

      // Store booking ID
      localStorage.setItem('featureme_bookingId', bookingId)

      // Payment is automatically created with FAILED status since Stripe is not implemented
      // All booking information is stored in the database for lookup purposes
      alert('Booking created successfully! All information has been saved. Payment gateway is not yet implemented, so payment is marked as failed for lookup purposes.')
      
      // Clear booking flow data
      localStorage.removeItem('featureme_locationId')
      localStorage.removeItem('featureme_scheduleId')
      localStorage.removeItem('featureme_mediaIds')
      localStorage.removeItem('featureme_planId')
      localStorage.removeItem('featureme_templateId')
      localStorage.removeItem('featureme_templateData')
      localStorage.removeItem('featureme_scheduleDate')
      localStorage.removeItem('featureme_scheduleStartTime')
      localStorage.removeItem('featureme_scheduleEndTime')

      // Navigate to dashboard to view booking
      navigate('/dashboard')

    } catch (error) {
      console.error('Error creating booking:', error)
      const errorMessage = error.message || 'Failed to create booking. Please try again.'
      
      // Check if it's a collision error
      if (errorMessage.includes('already booked') || errorMessage.includes('conflict')) {
        setError(`${errorMessage}. Please select a different date or location.`)
      } else {
        setError(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleWhatsAppFallback = async () => {
    try {
      // Get booking details for WhatsApp message
      const locationName = bookingData?.location?.name || 'Selected Location'
      const eventDate = bookingData?.schedule?.date 
        ? new Date(bookingData.schedule.date).toLocaleDateString()
        : 'Selected Date'
      const planName = bookingData?.plan?.name || 'Selected Plan'
      
      const message = `Hello! I need help with my billboard booking on FeatureMe.\n\n` +
        `Location: ${locationName}\n` +
        `Event Date: ${eventDate}\n` +
        `Plan: ${planName}\n\n` +
        `I'm having trouble completing the booking process. Can you please assist me?`
      
      const response = await api.getWhatsAppContact(message)
      setWhatsappLink(response.whatsappLink)
      setShowWhatsAppFallback(true)
      
      // Open WhatsApp in new tab
      window.open(response.whatsappLink, '_blank')
    } catch (error) {
      console.error('Error getting WhatsApp link:', error)
      alert('Failed to generate WhatsApp link. Please contact support directly.')
    }
  }

  if (!user) {
    return (
      <div className="App">
        {showAuthModal && <AuthModal onClose={() => navigate('/')} />}
      </div>
    )
  }

  if (error && !bookingData) {
    return (
      <div className="App">
        <main className="page-container">
          <div className="page-content">
            <div className="error-state">
              <p>{error}</p>
              <button className="btn btn-blue" onClick={() => navigate('/locations')}>
                Start Over
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="App">
      <main className="page-container checkout-page">
        <div className="page-content">
          <h1 className="page-title checkout-header-title">
            <span className="gradient-magenta">Review</span>{' '}
            <span className="gradient-blue">Your Booking</span>
          </h1>
          <p className="page-description">
            Review your booking details and proceed to payment
          </p>

          {bookingData && (
            <div className="checkout-summary">
              <div className="summary-section">
                <h3>Location</h3>
                <p>{bookingData.location?.name || 'N/A'}</p>
                <p className="summary-detail">{bookingData.location?.address || ''}</p>
              </div>

              <div className="summary-section">
                <h3>Schedule</h3>
                <p>
                  {bookingData.schedule?.date 
                    ? new Date(bookingData.schedule.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                        weekday: 'long'
                      })
                    : 'N/A'}
                </p>
              </div>

              <div className="summary-section">
                <h3>Template</h3>
                <p className="plan-name-summary">{bookingData.template?.name || 'N/A'}</p>
                {bookingData.template?.description && (
                  <p className="summary-detail">{bookingData.template.description}</p>
                )}
              </div>

              <div className="summary-section">
                <h3>Media ({Array.isArray(bookingData.media) ? bookingData.media.length : (bookingData.media ? 1 : 0)} {Array.isArray(bookingData.media) && bookingData.media.length === 1 ? 'file' : 'files'})</h3>
                {bookingData.media && (
                  <div className="media-preview-grid">
                    {(Array.isArray(bookingData.media) ? bookingData.media : [bookingData.media]).map((mediaItem, index) => (
                      <div key={mediaItem.id || index} className="media-preview-item">
                        {mediaItem.type === 'image' || mediaItem.type === 'IMAGE' ? (
                          <img 
                            src={mediaItem.url} 
                            alt={mediaItem.filename || mediaItem.originalName || `Media ${index + 1}`} 
                            className="summary-media-preview" 
                          />
                        ) : (
                          <video 
                            src={mediaItem.url} 
                            className="summary-media-preview" 
                            controls 
                          />
                        )}
                        <p className="media-filename">{mediaItem.filename || mediaItem.originalName || `Media ${index + 1}`}</p>
                        {mediaItem.featureType && (
                          <p className="summary-detail media-feature-type">
                            Content Type: {mediaItem.featureType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="summary-section">
                <h3>Plan</h3>
                <p className="plan-name-summary">{bookingData.plan?.name || 'N/A'}</p>
                <p className="plan-price-summary">
                  ₹{bookingData.plan?.price?.toLocaleString('en-IN') || '0'} 
                  {bookingData.plan?.duration && ` / ${bookingData.plan.duration} day${bookingData.plan.duration > 1 ? 's' : ''}`}
                </p>
                {bookingData.plan?.displayDurationSeconds === null && (
                  <div style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    background: 'rgba(132, 0, 255, 0.2)',
                    borderRadius: '8px',
                    border: '1px solid rgba(132, 0, 255, 0.4)'
                  }}>
                    <p style={{ color: '#ffffff', fontSize: '0.9rem', margin: 0, fontWeight: '600' }}>
                      📞 Custom Plan Selected
                    </p>
                    <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.85rem', marginTop: '0.5rem', marginBottom: 0 }}>
                      Our admin team will contact you soon to discuss your customization requirements and finalize the booking details.
                    </p>
                  </div>
                )}
                {bookingData.plan?.displayDurationSeconds !== null && bookingData.plan?.displayDurationSeconds !== undefined && (
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                    Display Duration: <strong>{bookingData.plan.displayDurationSeconds} seconds</strong>
                  </p>
                )}
                {bookingData.plan?.features && (
                  <ul className="plan-features-summary">
                    {bookingData.plan.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="summary-total">
                <h3>Total</h3>
                <p className="total-price">
                  ₹{bookingData.plan?.price?.toLocaleString('en-IN') || '0'}
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {paymentIntent && (
            <div className="payment-success">
              <p>Payment intent created successfully!</p>
              <p>Client Secret: {paymentIntent.clientSecret?.substring(0, 20)}...</p>
            </div>
          )}

          <div className="action-buttons">
            <button 
              className="btn btn-blue" 
              onClick={handleCreateBooking}
              disabled={loading || !bookingData}
            >
              {loading ? 'Processing...' : 'Create Booking & Save Information'}
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => navigate('/plan')}
              disabled={loading}
            >
              Back to Plans
            </button>
          </div>

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <button 
              className="btn btn-purple" 
              onClick={handleWhatsAppFallback}
              disabled={loading}
            >
              💬 Need Help? Contact via WhatsApp
            </button>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
              Having trouble? Our team can help you complete your booking manually.
            </p>
          </div>

          {showWhatsAppFallback && whatsappLink && (
            <div className="whatsapp-fallback-info" style={{
              marginTop: '1.5rem',
              padding: '1rem',
              background: 'rgba(37, 211, 102, 0.1)',
              border: '1px solid rgba(37, 211, 102, 0.3)',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <p style={{ color: '#25d366', marginBottom: '0.5rem' }}>
                WhatsApp link generated! If it didn't open automatically,{' '}
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={{ color: '#25d366', textDecoration: 'underline' }}>
                  click here
                </a>
              </p>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                Our team will help you complete your booking manually.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Checkout

