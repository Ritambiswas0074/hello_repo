import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthModal from '../components/AuthModal'
import MagicBento from '../components/MagicBento'
import CircularText from '../components/CircularText'
import api from '../services/api'
import '../App.css'
import './Upload.css'

function Upload() {
  const [selectedFiles, setSelectedFiles] = useState([])
  const [uploadedMedia, setUploadedMedia] = useState([])
  const [uploading, setUploading] = useState(false)
  const [featureType, setFeatureType] = useState('')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()
  const uploadMediaRef = useRef([]) // Ref to track all uploaded media

  useEffect(() => {
    // Check if template is selected
    const templateId = localStorage.getItem('featureme_templateId')
    if (!templateId) {
      navigate('/template')
      return
    }

    // Clear any previously stored media IDs for this booking flow
    // Only show media uploaded in current session
    const storedMediaIds = localStorage.getItem('featureme_mediaIds')
    if (storedMediaIds) {
      // If there are stored media IDs, we could load them, but for now we'll start fresh
      // This ensures only current session uploads are shown
      localStorage.removeItem('featureme_mediaIds')
    }
    
    // Initialize with empty array - only show media uploaded in current session
    // Only clear on initial mount, not on every render
    setUploadedMedia([])
    uploadMediaRef.current = []
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run once on mount

  // Debug: Log uploadedMedia whenever it changes
  useEffect(() => {
    console.log('uploadedMedia state changed:', uploadedMedia.length, 'items')
    uploadedMedia.forEach((media, index) => {
      console.log(`  [${index}] ID: ${media.id}, Filename: ${media.filename}, URL: ${media.url?.substring(0, 50)}...`)
    })
  }, [uploadedMedia])

  const handleFileChange = async (e) => {
    if (!user) {
      setShowAuthModal(true)
      e.target.value = ''
      return
    }

    // Check if feature type is selected
    if (!featureType) {
      alert('Please select what you would like to feature first (Yourself, Loved Ones, Family, or Branding)')
      e.target.value = ''
      return
    }

    // Check if template is selected
    const templateId = localStorage.getItem('featureme_templateId')
    if (!templateId) {
      alert('Please select a template first')
      navigate('/template')
      e.target.value = ''
      return
    }

    const files = Array.from(e.target.files)
    
    if (files.length === 0) return

    setUploading(true)

    try {
      // Upload files one by one with templateId and featureType
      // Collect all successful uploads and errors
      const uploadResults = []
      const errors = []
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        try {
          console.log(`Uploading file ${i + 1}/${files.length}: ${file.name}`)
          const response = await api.uploadMedia(file, templateId, featureType)
          console.log(`Upload response for ${file.name}:`, response)
          
          if (response && response.media) {
            console.log(`Successfully uploaded ${file.name}, media ID: ${response.media.id}`)
            uploadResults.push(response.media)
          } else {
            console.error(`Invalid response for ${file.name}:`, response)
            errors.push({ fileName: file.name, error: 'Invalid response from server' })
          }
        } catch (fileError) {
          console.error(`Error uploading file ${file.name}:`, fileError)
          errors.push({ fileName: file.name, error: fileError.message || 'Upload failed' })
        }
      }
      
      console.log(`Total upload results: ${uploadResults.length}`, uploadResults)
      
      // Verify all media have unique IDs
      const mediaIds = uploadResults.map(m => m?.id).filter(Boolean)
      const uniqueIds = new Set(mediaIds)
      if (mediaIds.length !== uniqueIds.size) {
        console.error('WARNING: Duplicate media IDs in upload results!', {
          total: mediaIds.length,
          unique: uniqueIds.size,
          ids: mediaIds
        })
      }
      
      // Update state with all successfully uploaded media at once
      if (uploadResults.length > 0) {
        console.log(`Updating state with ${uploadResults.length} uploaded media items`)
        
        // Use functional update to ensure we get the latest state
        setUploadedMedia(prev => {
          console.log(`Previous media count: ${prev.length}`, prev.map(m => ({ id: m.id, filename: m.filename })))
          
          // Combine previous media with new uploads, avoiding duplicates
          const existingIds = new Set(prev.map(m => m.id))
          const newMedia = uploadResults.filter(m => {
            if (!m || !m.id) {
              console.error('Invalid media object:', m)
              return false
            }
            const isNew = !existingIds.has(m.id)
            if (!isNew) {
              console.warn(`Duplicate media ID detected: ${m.id} (${m.filename})`)
            }
            return isNew
          })
          
          console.log(`New media to add: ${newMedia.length}`, newMedia.map(m => ({ id: m.id, filename: m.filename })))
          
          if (newMedia.length === 0) {
            console.warn('No new media to add after filtering duplicates!')
            console.warn('Upload results:', uploadResults)
            console.warn('Existing IDs:', Array.from(existingIds))
            return prev
          }
          
          const updatedMedia = [...prev, ...newMedia]
          console.log(`Final media count: ${updatedMedia.length}`, updatedMedia.map(m => ({ id: m.id, filename: m.filename })))
          
          // Update ref to match
          uploadMediaRef.current = updatedMedia
          
          // Double-check we have all items
          if (updatedMedia.length !== prev.length + newMedia.length) {
            console.error('State update error! Expected:', prev.length + newMedia.length, 'Got:', updatedMedia.length)
          }
          
          return updatedMedia
        })
      } else {
        console.warn('No upload results to add to state!')
      }
      
      // Show summary of uploads
      if (errors.length > 0) {
        const errorMsg = `${uploadResults.length} file(s) uploaded successfully. ${errors.length} file(s) failed:\n${errors.map(e => `- ${e.fileName}: ${e.error}`).join('\n')}`
        alert(errorMsg)
      } else if (uploadResults.length > 0) {
        // Success - files are uploaded and will be displayed
        console.log(`Successfully uploaded ${uploadResults.length} file(s)`)
      }
      
      // Clear selected files after upload attempt
      setSelectedFiles([])
      e.target.value = ''
    } catch (error) {
      console.error('Error in upload process:', error)
      alert(error.message || 'Failed to upload files')
    } finally {
      setUploading(false)
    }
  }

  const removeFile = async (mediaId) => {
    if (!window.confirm('Are you sure you want to delete this media?')) {
      return
    }

    try {
      await api.deleteMedia(mediaId)
      setUploadedMedia(prev => {
        const filtered = prev.filter(m => m.id !== mediaId)
        uploadMediaRef.current = filtered
        return filtered
      })
    } catch (error) {
      console.error('Error deleting media:', error)
      alert(error.message || 'Failed to delete media')
    }
  }

  const handleContinue = (e) => {
    if (!user) {
      e.preventDefault()
      setShowAuthModal(true)
      return
    }
    
    // Store selected media IDs for booking flow
    if (uploadedMedia.length > 0) {
      const mediaIds = uploadedMedia.map(m => m.id)
      localStorage.setItem('featureme_mediaIds', JSON.stringify(mediaIds))
      navigate('/plan')
    } else {
      alert('Please upload at least one media file to continue')
    }
  }

  return (
    <div className="App">
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      <main className="page-container">
        <div className="page-content">
          <h1 className="page-title">
            <span className="gradient-magenta">Upload</span>{' '}
            <span className="gradient-blue">Your Content</span>
          </h1>
          <p className="page-description">
            Upload your videos and photos to feature on our billboards
          </p>

          <MagicBento
            textAutoHide={false}
            enableStars={true}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={false}
            enableMagnetism={false}
            clickEffect={false}
            spotlightRadius={400}
            particleCount={8}
            glowColor="132, 0, 255"
          >
            <div className="upload-section magic-bento-container magic-bento-card--border-glow">
              <div className="feature-type-selector">
                <label>What would you like to feature?</label>
                <div className="radio-group">
                  <label className={`radio-option ${featureType === 'yourself' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="featureType"
                      value="yourself"
                      checked={featureType === 'yourself'}
                      onChange={(e) => setFeatureType(e.target.value)}
                    />
                    <span>Yourself</span>
                  </label>
                  <label className={`radio-option ${featureType === 'loved-ones' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="featureType"
                      value="loved-ones"
                      checked={featureType === 'loved-ones'}
                      onChange={(e) => setFeatureType(e.target.value)}
                    />
                    <span>Loved Ones</span>
                  </label>
                  <label className={`radio-option ${featureType === 'family' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="featureType"
                      value="family"
                      checked={featureType === 'family'}
                      onChange={(e) => setFeatureType(e.target.value)}
                    />
                    <span>Family</span>
                  </label>
                  <label className={`radio-option ${featureType === 'branding' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="featureType"
                      value="branding"
                      checked={featureType === 'branding'}
                      onChange={(e) => setFeatureType(e.target.value)}
                    />
                    <span>Branding</span>
                  </label>
                </div>
              </div>

            <div className="upload-area">
                <input
                type="file"
                id="file-upload"
                multiple
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="file-input"
                disabled={uploading || !user || !featureType}
              />
              <label htmlFor="file-upload" className={`upload-label ${uploading || !user || !featureType ? 'disabled' : ''}`}>
                <div className="upload-icon">
                  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="upload-icon-svg">
                    <defs>
                      <linearGradient id="uploadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ff00ff" />
                        <stop offset="50%" stopColor="#b84dff" />
                        <stop offset="100%" stopColor="#00bfff" />
                      </linearGradient>
                      <linearGradient id="uploadGradientLight" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ff66ff" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#66d9ff" stopOpacity="0.6" />
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    {/* Cloud background */}
                    <ellipse cx="40" cy="50" rx="20" ry="12" fill="url(#uploadGradientLight)" opacity="0.3"/>
                    <ellipse cx="35" cy="48" rx="15" ry="8" fill="url(#uploadGradientLight)" opacity="0.2"/>
                    {/* Main upload arrow */}
                    <g filter="url(#glow)">
                      <path d="M40 15 L40 50" stroke="url(#uploadGradient)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M30 35 L40 25 L50 35" stroke="url(#uploadGradient)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                      {/* Arrow head fill */}
                      <path d="M30 35 L40 25 L50 35 L45 35 L40 30 L35 35 Z" fill="url(#uploadGradient)" opacity="0.8"/>
                    </g>
                    {/* Decorative particles */}
                    <circle cx="20" cy="30" r="2" fill="url(#uploadGradient)" opacity="0.6" className="particle-1"/>
                    <circle cx="60" cy="35" r="1.5" fill="url(#uploadGradient)" opacity="0.5" className="particle-2"/>
                    <circle cx="25" cy="55" r="1.5" fill="url(#uploadGradient)" opacity="0.4" className="particle-3"/>
                    <circle cx="55" cy="60" r="2" fill="url(#uploadGradient)" opacity="0.5" className="particle-4"/>
                  </svg>
                </div>
                {uploading ? (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60px' }}>
                    <CircularText
                      text="FEATURE*ME*"
                      onHover="speedUp"
                      spinDuration={15}
                      className="upload-loading-text"
                    />
                  </div>
                ) : (
                  <p>{!featureType ? 'Please select a feature type above to upload' : 'Click to upload or drag and drop'}</p>
                )}
                <p className="upload-hint">
                  {!featureType ? 'Select Yourself, Loved Ones, Family, or Branding first' : 
                   uploadedMedia.length > 0 ? `${uploadedMedia.length} file(s) uploaded` : 
                   'Videos and Images (MP4, MOV, JPG, PNG)'}
                </p>
              </label>
            </div>

            {uploadedMedia.length > 0 && (
              <div className="file-list">
                <h3>Current Uploaded Media ({uploadedMedia.length} {uploadedMedia.length === 1 ? 'file' : 'files'}):</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  Only media uploaded in this session will be used for your booking
                </p>
                <div className="files-grid">
                  {uploadedMedia.map((media, index) => {
                    // Ensure unique key - use index as fallback if id is missing
                    const uniqueKey = media.id || `media-${index}-${media.filename || Date.now()}`
                    console.log(`Rendering media item ${index}:`, { id: media.id, filename: media.filename, key: uniqueKey })
                    return (
                      <div key={uniqueKey} className="file-item">
                        <div className="file-preview">
                          {(media.type === 'IMAGE' || media.type === 'image' || media.type?.toUpperCase() === 'IMAGE') ? (
                            <img src={media.url} alt={media.filename || media.originalName || 'Image'} className="media-preview" />
                          ) : (
                            <video src={media.url} className="media-preview" controls />
                          )}
                        </div>
                        <p className="file-name">{media.filename || media.originalName || 'Media file'}</p>
                        <button
                          className="remove-file"
                          onClick={() => removeFile(media.id)}
                          aria-label="Remove file"
                        >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="remove-icon-svg">
                          <defs>
                            <linearGradient id={`removeGradient-${media.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#ff00ff" />
                              <stop offset="50%" stopColor="#b84dff" />
                              <stop offset="100%" stopColor="#00bfff" />
                            </linearGradient>
                            <filter id={`removeGlow-${media.id}`}>
                              <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                              <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                              </feMerge>
                            </filter>
                          </defs>
                          <circle cx="12" cy="12" r="10" stroke={`url(#removeGradient-${media.id})`} strokeWidth="1.5" fill="none" opacity="0.3" filter={`url(#removeGlow-${media.id})`}/>
                          <line x1="15" y1="9" x2="9" y2="15" stroke={`url(#removeGradient-${media.id})`} strokeWidth="2.5" strokeLinecap="round" filter={`url(#removeGlow-${media.id})`}/>
                          <line x1="9" y1="9" x2="15" y2="15" stroke={`url(#removeGradient-${media.id})`} strokeWidth="2.5" strokeLinecap="round" filter={`url(#removeGlow-${media.id})`}/>
                        </svg>
                      </button>
                    </div>
                    )
                  })}
                </div>
              </div>
            )}

              <div className="action-buttons">
                <button 
                  className="btn btn-blue"
                  onClick={(e) => {
                    handleContinue(e)
                    if (user && uploadedMedia.length > 0) {
                      navigate('/plan')
                    }
                  }}
                  disabled={!user || uploadedMedia.length === 0 || uploading}
                >
                  {uploading ? 'Uploading...' : uploadedMedia.length === 0 ? 'Upload Media to Continue' : 'Continue to Plan Selection'}
                </button>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => navigate('/template')}
                  disabled={uploading}
                >
                  Back to Template
                </button>
              </div>
            </div>
          </MagicBento>
        </div>
      </main>
    </div>
  )
}

export default Upload
