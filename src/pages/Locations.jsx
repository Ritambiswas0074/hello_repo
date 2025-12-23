import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthModal from '../components/AuthModal'
import AnimatedList from '../components/AnimatedList'
import CircularText from '../components/CircularText'
import api from '../services/api'
import '../App.css'
import './Locations.css'

function Locations() {
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [loadingLocation, setLoadingLocation] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [whatsappLink, setWhatsappLink] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleWhatsAppHelp = async () => {
    try {
      const message = `Hello! I need help selecting a location for my billboard booking on FeatureMe. Can you please assist me?`
      const response = await api.getWhatsAppContact(message)
      setWhatsappLink(response.whatsappLink)
      window.open(response.whatsappLink, '_blank')
    } catch (error) {
      console.error('Error getting WhatsApp link:', error)
      alert('Failed to generate WhatsApp link. Please contact support directly.')
    }
  }

  useEffect(() => {
    fetchLocations()
  }, [])

  const fetchLocations = async () => {
    try {
      setLoading(true)
      const response = await api.getLocations({ isActive: true })
      setLocations(response.locations || [])
    } catch (error) {
      console.error('Error fetching locations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLocationSelect = async (locationId) => {
    console.log('handleLocationSelect called with:', locationId)
    
    if (!user) {
      setShowAuthModal(true)
      return
    }
    
    // Prevent selecting the same location again
    if (selectedLocation === locationId && !loadingLocation) {
      return
    }
    
    // Set selected location immediately for UI feedback
    setSelectedLocation(locationId)
    setLoadingLocation(true)
    
    try {
      // Fetch location details from API
      const locationDetails = await api.getLocationById(locationId)
      console.log('Location details fetched:', locationDetails)
      
      // Store location ID
      localStorage.setItem('featureme_locationId', locationId)
      
      // Store full location data if needed
      const locationData = locationDetails.location || locationDetails
      if (locationData) {
        localStorage.setItem('featureme_locationData', JSON.stringify(locationData))
      }
      
      console.log('Location stored in localStorage:', locationId)
    } catch (error) {
      console.error('Error fetching location details:', error)
      // Don't show alert for cancelled requests
      if (error.isCancelled || error.name === 'CancelledError') {
        return
      }
      // Clear selection on error
      setSelectedLocation(null)
      alert('Failed to load location details. Please try again.')
    } finally {
      setLoadingLocation(false)
    }
  }

  const handleContinue = async (e) => {
    e.preventDefault()
    if (!user) {
      setShowAuthModal(true)
      return
    }
    if (!selectedLocation) {
      alert('Please select a location first')
      return
    }

    try {
      // Ensure location is saved in localStorage
      localStorage.setItem('featureme_locationId', selectedLocation)
      
      // Use cached location data if available (already stored in handleLocationSelect)
      const cachedLocationData = localStorage.getItem('featureme_locationData')
      if (!cachedLocationData) {
        // Only fetch if not already cached
        const locationDetails = await api.getLocationById(selectedLocation)
        const locationData = locationDetails.location || locationDetails
        if (locationData) {
          localStorage.setItem('featureme_locationData', JSON.stringify(locationData))
        }
      }
      
      console.log('Location saved for user:', user.id, 'Location:', selectedLocation)
      
      // Navigate to Schedule page
      navigate('/schedule')
    } catch (error) {
      console.error('Error saving location:', error)
      alert('Failed to save location. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="App">
        <main className="page-container locations-page">
          <div className="page-content locations-page-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
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
      <main className="page-container locations-page">
        <div className="page-content locations-page-content">
          <div className="locations-header">
            <h1 className="page-title">
              <span className="gradient-magenta">Select</span>{' '}
              <span className="gradient-blue">Location</span>
            </h1>
            <p className="page-description">
              Choose from our available billboard locations across the country
            </p>
          </div>

          {locations.length === 0 ? (
            <div className="empty-state">
              <p>No locations available at the moment.</p>
            </div>
          ) : (
            <div className="locations-animated-list">
              <AnimatedList
                items={locations}
                onItemSelect={(location, index) => {
                  if (location.isActive) {
                    handleLocationSelect(location.id);
                  }
                }}
                showGradients={false}
                enableArrowNavigation={true}
                displayScrollbar={true}
                initialSelectedIndex={-1}
                horizontal={true}
                renderItem={(location, index, isSelected) => (
                  <div 
                    className={`location-card-item ${selectedLocation === location.id ? 'selected' : ''} ${isSelected ? 'selected' : ''} ${!location.isActive ? 'unavailable' : ''}`}
                    style={{ cursor: location.isActive ? 'pointer' : 'not-allowed' }}
                  >
                    {!location.isActive && (
                      <div className="unavailable-badge">Unavailable</div>
                    )}
                    <div className="location-card-content">
                      <div className="location-left-section">
                        <div className="location-header">
                          <div className="location-name-wrapper">
                            <h3>{location.name}</h3>
                            {location.isActive && (
                              <span className="available-dot"></span>
                            )}
                          </div>
                          <span className="location-city">{location.city}</span>
                        </div>
                        <div className="location-details">
                          {location.address && (
                            <div className="detail-item">
                              <p className="location-address">{location.address}</p>
                            </div>
                          )}
                          {location.description && (
                            <div className="detail-item">
                              <p className="location-description">{location.description}</p>
                            </div>
                          )}
                          {location.latitude && location.longitude && (
                            <div className="detail-item">
                              <p className="location-coordinates">
                                Latitude: {location.latitude}, Longitude: {location.longitude}
                              </p>
                            </div>
                          )}
                        </div>
                        {location.isActive && (
                          <div className="location-buttons-row">
                            <div className="location-radio-container" onClick={() => handleLocationSelect(location.id)}>
                            <input
                              type="radio"
                              id={`location-${location.id}`}
                              name="location-selection"
                              value={location.id}
                              checked={selectedLocation === location.id}
                              onChange={() => handleLocationSelect(location.id)}
                              className="location-radio"
                            />
                            <label htmlFor={`location-${location.id}`} className="location-radio-label">
                                Select
                            </label>
                          </div>
                          {location.latitude && location.longitude && (
                            <a
                              href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="view-map-button"
                            >
                                Maps
                            </a>
                          )}
                        </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              />
            </div>
          )}

          {selectedLocation && (
            <div className="action-buttons">
              <button 
                className="btn btn-purple"
                onClick={handleContinue}
                disabled={loadingLocation}
              >
                {loadingLocation ? 'Loading...' : 'Continue to Schedule Date'}
              </button>
              <p className="selection-hint" style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem', marginTop: '0.5rem', textAlign: 'center' }}>
                Location selected: {locations.find(l => l.id === selectedLocation)?.name || 'Selected'}
              </p>
            </div>
          )}

          <div className="whatsapp-help-section">
            <button 
              className="btn btn-secondary" 
              onClick={handleWhatsAppHelp}
              style={{ fontSize: '0.9rem', padding: '0.75rem 1.5rem' }}
            >
              💬 Need Help? Contact via WhatsApp
            </button>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
              Having trouble? Our team can help you complete your booking manually.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Locations
