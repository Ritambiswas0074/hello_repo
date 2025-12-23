import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthModal from '../components/AuthModal'
import AnimatedList from '../components/AnimatedList'
import CircularText from '../components/CircularText'
import api from '../services/api'
import '../App.css'
import './Template.css'

function Template() {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [loadingTemplate, setLoadingTemplate] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [whatsappLink, setWhatsappLink] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleWhatsAppHelp = async () => {
    try {
      const message = `Hello! I need help selecting a template for my billboard booking on FeatureMe. Can you please assist me?`
      const response = await api.getWhatsAppContact(message)
      setWhatsappLink(response.whatsappLink)
      window.open(response.whatsappLink, '_blank')
    } catch (error) {
      console.error('Error getting WhatsApp link:', error)
      alert('Failed to generate WhatsApp link. Please contact support directly.')
    }
  }

  useEffect(() => {
    // Check if user came from schedule page
    const scheduleId = localStorage.getItem('featureme_scheduleId')
    if (!scheduleId) {
      navigate('/schedule')
      return
    }

    fetchTemplates()
  }, [navigate])

  const fetchTemplates = async () => {
    try {
      setLoading(true)
      const response = await api.getTemplates({ isActive: true })
      const templatesList = response.templates || response || []
      console.log('Fetched templates:', templatesList)
      setTemplates(templatesList)
    } catch (error) {
      console.error('Error fetching templates:', error)
      setTemplates([])
    } finally {
      setLoading(false)
    }
  }

  const handleTemplateSelect = async (templateId) => {
    console.log('handleTemplateSelect called with:', templateId)
    
    if (!user) {
      setShowAuthModal(true)
      return
    }
    
    // Prevent selecting the same template again
    if (selectedTemplate === templateId && !loadingTemplate) {
      return
    }
    
    // Set selected template immediately for UI feedback
    setSelectedTemplate(templateId)
    setLoadingTemplate(true)
    
    try {
      // Fetch template details from API
      const templateDetails = await api.getTemplateById(templateId)
      console.log('Template details fetched:', templateDetails)
      
      // Store template ID
      localStorage.setItem('featureme_templateId', templateId)
      
      // Store full template data if needed
      const templateData = templateDetails.template || templateDetails
      if (templateData) {
        localStorage.setItem('featureme_templateData', JSON.stringify(templateData))
      }
      
      console.log('Template stored in localStorage:', templateId)
    } catch (error) {
      console.error('Error fetching template details:', error)
      // Clear selection on error
      setSelectedTemplate(null)
      alert('Failed to load template details. Please try again.')
    } finally {
      setLoadingTemplate(false)
    }
  }

  const handleContinue = async (e) => {
    e.preventDefault()
    if (!user) {
      setShowAuthModal(true)
      return
    }
    if (!selectedTemplate) {
      alert('Please select a template first')
      return
    }

    try {
      // Ensure template is saved in localStorage
      localStorage.setItem('featureme_templateId', selectedTemplate)
      
      // Get template details to save full info
      const templateDetails = await api.getTemplateById(selectedTemplate)
      const templateData = templateDetails.template || templateDetails
      
      if (templateData) {
        localStorage.setItem('featureme_templateData', JSON.stringify(templateData))
      }
      
      console.log('Template saved for user:', user.id, 'Template:', selectedTemplate)
      
      // Navigate to Upload page
      navigate('/upload')
    } catch (error) {
      console.error('Error saving template:', error)
      alert('Failed to save template. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="App">
        <main className="page-container template-page">
          <div className="page-content template-page-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
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
      <main className="page-container template-page">
        <div className="page-content template-page-content">
          <div className="template-header">
            <h1 className="page-title">
              <span className="gradient-magenta">Select</span>{' '}
              <span className="gradient-blue">Template</span>
            </h1>
            <p className="page-description">
              Choose a billboard template for your content
            </p>
          </div>

          {!loading && templates.length === 0 ? (
            <div className="empty-state">
              <p>No templates available at the moment.</p>
            </div>
          ) : templates.length > 0 ? (
            <div className="templates-animated-list">
              <AnimatedList
                items={templates}
                onItemSelect={(template, index) => {
                  if (template.isActive) {
                    handleTemplateSelect(template.id);
                  }
                }}
                showGradients={false}
                enableArrowNavigation={true}
                displayScrollbar={true}
                initialSelectedIndex={-1}
                horizontal={true}
                renderItem={(template, index, isSelected) => (
                  <div 
                    key={template.id}
                    className={`template-card-item ${selectedTemplate === template.id ? 'selected' : ''} ${isSelected ? 'selected' : ''} ${!template.isActive ? 'unavailable' : ''}`}
                    style={{ cursor: template.isActive ? 'pointer' : 'not-allowed' }}
                  >
                    {!template.isActive && (
                      <div className="unavailable-badge">Unavailable</div>
                    )}
                    <div className="template-card-content">
                      <div className="template-left-section">
                        <div className="template-header-section">
                          <div className="template-name-wrapper">
                            <h3>{template.name}</h3>
                            {template.isActive && (
                              <span className="available-dot"></span>
                            )}
                          </div>
                        </div>
                        <div className="template-details">
                          {template.description && (
                            <div className="detail-item">
                              <p className="template-description">{template.description}</p>
                            </div>
                          )}
                        </div>
                        {template.isActive && (
                          <div className="template-buttons-row">
                            <div className="template-radio-container" onClick={() => handleTemplateSelect(template.id)}>
                              <input
                                type="radio"
                                id={`template-${template.id}`}
                                name="template-selection"
                                value={template.id}
                                checked={selectedTemplate === template.id}
                                onChange={() => handleTemplateSelect(template.id)}
                                className="template-radio"
                              />
                              <label htmlFor={`template-${template.id}`} className="template-radio-label">
                                {selectedTemplate === template.id ? 'Selected' : 'Select'}
                              </label>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="template-right-section">
                        <div className="template-preview-container">
                          {template.previewUrl ? (
                            <img 
                              src={template.previewUrl} 
                              alt={template.name}
                              className="template-preview-image"
                            />
                          ) : (
                            <div className="template-preview-placeholder">
                              <svg width="60" height="60" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                  <linearGradient id={`templateGradient-${template.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#ff00ff" />
                                    <stop offset="50%" stopColor="#b84dff" />
                                    <stop offset="100%" stopColor="#00bfff" />
                                  </linearGradient>
                                </defs>
                                <rect x="10" y="10" width="60" height="60" rx="8" stroke={`url(#templateGradient-${template.id})`} strokeWidth="2" fill="none" opacity="0.3"/>
                                <rect x="20" y="25" width="40" height="30" rx="4" fill={`url(#templateGradient-${template.id})`} opacity="0.2"/>
                                <circle cx="35" cy="40" r="3" fill={`url(#templateGradient-${template.id})`} opacity="0.5"/>
                                <circle cx="45" cy="40" r="3" fill={`url(#templateGradient-${template.id})`} opacity="0.5"/>
                              </svg>
                              <p>Preview</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              />
            </div>
          ) : null}

          {selectedTemplate && (
            <div className="action-buttons">
              <button 
                className="btn btn-purple"
                onClick={handleContinue}
                disabled={loadingTemplate}
              >
                {loadingTemplate ? 'Loading...' : 'Continue to Upload'}
              </button>
              <p className="selection-hint" style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem', marginTop: '0.5rem', textAlign: 'center' }}>
                Template selected: {templates.find(t => t.id === selectedTemplate)?.name || 'Selected'}
              </p>
            </div>
          )}

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
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

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <button 
              className="btn btn-secondary" 
              onClick={() => navigate('/schedule')}
              style={{ fontSize: '0.9rem', padding: '0.75rem 1.5rem' }}
            >
              Back to Schedule
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Template

