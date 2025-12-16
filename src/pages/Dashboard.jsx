import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import CircularGallery from '../components/CircularGallery'
import CircularText from '../components/CircularText'
import api from '../services/api'
import '../App.css'
import './Dashboard.css'

function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState(null)
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)

  useEffect(() => {
    if (user) {
      fetchDashboard()
    }
  }, [user])

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      // Fetch user activity data
      const activityRes = await api.getUserActivity().catch(() => ({ users: [], summary: {} }))
      
      // Find current user's data from the response
      const currentUserEmail = user?.email
      const currentUserData = activityRes.users?.find(u => u.userEmail === currentUserEmail)
      
      // Format bookings for display (only essential info)
      const formattedBookings = currentUserData?.bookings?.map(booking => ({
        id: booking.bookingId,
        bookingStatus: booking.bookingStatus,
        // User information
        userName: currentUserData.userName,
        // Event timing
        eventDate: booking.schedule.date,
        eventDateFormatted: booking.schedule.dateFormatted,
        eventStartTimeFormatted: booking.schedule.startTimeFormatted,
        eventTimeSlot: booking.schedule.timeSlot,
        eventDateTime: booking.schedule.eventDateTime,
        // Location
        locationName: booking.location.name,
        locationCity: booking.location.city,
        locationAddress: booking.location.address,
        // Template
        templateName: booking.template.name,
        templateDescription: booking.template.description,
        // Media (all media items for this booking)
        media: booking.media || [],
        mediaCount: booking.mediaCount || 0,
        // Timestamps
        createdAt: booking.bookingCreatedAt,
        updatedAt: booking.bookingUpdatedAt,
      })) || []
      
      // Merge with dashboard data
      setDashboardData({
        media: currentUserData?.uploadedImages?.concat(currentUserData?.uploadedVideos || []) || [],
        schedules: currentUserData?.schedules || [],
        stats: {
          totalBookings: currentUserData?.totalBookings || 0,
          totalMedia: currentUserData?.totalMediaUploads || 0,
          activeBookings: formattedBookings.filter(b => b.bookingStatus === 'ACTIVE').length,
          pendingPayments: formattedBookings.filter(b => b.bookingStatus === 'PENDING_PAYMENT').length,
        },
        bookings: formattedBookings,
        bookingSummary: {
          total: formattedBookings.length,
          paymentApproved: currentUserData?.paymentSummary?.successfulPayments || 0,
          paymentRejected: currentUserData?.paymentSummary?.rejectedPayments || 0,
        }
      })
    } catch (error) {
      console.error('Error fetching dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBooking = async () => {
    const locationId = localStorage.getItem('featureme_locationId')
    const scheduleId = localStorage.getItem('featureme_scheduleId')
    const mediaIds = JSON.parse(localStorage.getItem('featureme_mediaIds') || '[]')
    const planId = localStorage.getItem('featureme_planId')
    const templateId = 'tpl-1' // Default template

    if (!locationId || !scheduleId || mediaIds.length === 0 || !planId) {
      alert('Please complete the booking flow: Location → Schedule → Upload → Plan')
      navigate('/locations')
      return
    }

    try {
      const bookingData = {
        locationId,
        scheduleId,
        mediaId: mediaIds[0], // Use first media for now
        templateId,
        planId,
      }

      const response = await api.createBooking(bookingData)
      
      // Clear stored booking data
      localStorage.removeItem('featureme_locationId')
      localStorage.removeItem('featureme_scheduleId')
      localStorage.removeItem('featureme_mediaIds')
      localStorage.removeItem('featureme_planId')

      // Refresh dashboard
      fetchDashboard()

      alert('Booking created successfully!')
    } catch (error) {
      console.error('Error creating booking:', error)
      alert(error.message || 'Failed to create booking')
    }
  }

  const handleDeleteMedia = async (mediaId) => {
    if (!window.confirm('Are you sure you want to delete this media?')) {
      return
    }

    try {
      await api.deleteMedia(mediaId)
      fetchDashboard()
    } catch (error) {
      console.error('Error deleting media:', error)
      alert(error.message || 'Failed to delete media')
    }
  }

  if (loading) {
    return (
      <div className="App">
        <main className="dashboard-container">
          <div className="dashboard-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
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

  if (!dashboardData) {
    return (
      <div className="App">
        <main className="dashboard-container">
          <div className="dashboard-content">
            <p>Error loading dashboard data.</p>
          </div>
        </main>
      </div>
    )
  }

  const { media, schedules, bookings, stats } = dashboardData

  // Generate gallery items from uploaded media (images only)
  const getGalleryItems = () => {
    return media
      .filter(m => m.type === 'IMAGE' || m.type === 'image')
      .map((item) => {
        const nameWithoutExt = item.filename?.replace(/\.[^/.]+$/, '') || item.originalName?.replace(/\.[^/.]+$/, '') || 'Media'
        return {
          image: item.url,
          text: nameWithoutExt
        }
      })
  }

  const galleryItems = getGalleryItems()
  const videos = media.filter(m => m.type === 'VIDEO' || m.type === 'video')

  return (
    <div className="App">
      <main className="dashboard-container">
        <div className="dashboard-content">
          <div className="dashboard-header">
            <h1 className="dashboard-title">
              <span className="gradient-magenta">Welcome back,</span>{' '}
              <span className="gradient-blue">{user?.firstName || user?.email?.split('@')[0] || 'User'}</span>
            </h1>
            <p className="dashboard-subtitle">Manage your billboard campaigns and content</p>
          </div>

          {/* Stats Section
          <div className="dashboard-stats">
            <div className="stat-card">
              <h3>Total Bookings</h3>
              <p className="stat-value">{stats?.totalBookings || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Uploaded Media</h3>
              <p className="stat-value">{stats?.totalMedia || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Active Bookings</h3>
              <p className="stat-value">{stats?.activeBookings || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Pending Payments</h3>
              <p className="stat-value">{stats?.pendingPayments || 0}</p>
            </div>
          </div> */}

          {/* Content Sections */}
          <div className="dashboard-sections">
            <div className="content-section">
              <div className="section-header">
                <h2>Uploaded Contents</h2>
              </div>
              {media.length > 0 ? (
                <div className="content-gallery-wrapper">
                  {/* Show images in CircularGallery */}
                  {galleryItems.length > 0 && (
                    <div className="gallery-container">
                      <CircularGallery
                        items={galleryItems}
                        bend={3}
                        textColor="#ffffff"
                        borderRadius={0.05}
                        scrollEase={0.02}
                      />
                    </div>
                  )}
                  
                  {/* Show videos if any are present */}
                  {videos.length > 0 && (
                    <div className="videos-section">
                      <h3 className="videos-section-title">Videos</h3>
                      <div className="videos-grid">
                        {videos.map((video) => (
                            <div key={video.id} className="video-item">
                              <div className="video-preview-container">
                                {video.thumbnailUrl ? (
                                  <img 
                                    src={video.thumbnailUrl} 
                                    alt={video.filename || 'Video thumbnail'}
                                    className="video-thumbnail"
                                  />
                                ) : (
                                  <video 
                                    src={video.url} 
                                    className="video-preview"
                                    controls
                                  />
                                )}
                                <div className="video-overlay">
                                  <a 
                                    href={video.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="video-play-button"
                                  >
                                    ▶
                                  </a>
                                </div>
                              </div>
                              <div className="video-info">
                                <p className="video-name">{video.filename || 'Video'}</p>
                                {video.featureType && (
                                  <p className="video-feature-type">
                                    Type: {video.featureType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                  </p>
                                )}
                                <p className="video-meta">
                                  {new Date(video.createdAt).toLocaleDateString()}
                                </p>
                                <button 
                                  className="btn-small btn-secondary video-delete-btn" 
                                  onClick={() => handleDeleteMedia(video.id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="empty-content">
                  <p>No content uploaded yet.</p>
                </div>
              )}
            </div>

            <div className="schedule-section">
              <div className="section-header">
                <h2>Scheduled Events</h2>
              </div>
              {schedules.length > 0 ? (
                <div className="payments-table">
                  <div className="table-header">
                    <div>Date</div>
                    <div>Location</div>
                    <div>Status</div>
                  </div>
                  {schedules.map((schedule) => (
                    <div key={schedule.id} className="table-row">
                      <div>{new Date(schedule.date).toLocaleDateString()}</div>
                      <div className="payment-description">
                        {schedule.location?.name || 'Unknown Location'}
                      </div>
                      <div>
                        <span className={`status-badge ${schedule.isAvailable ? 'approved' : 'pending'}`}>
                          {schedule.isAvailable ? 'Available' : 'Booked'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-content">
                  <p>No scheduled events yet.</p>
                </div>
              )}
            </div>

            <div className="bookings-section">
              <div className="section-header">
                <h2>My Bookings</h2>
                {dashboardData?.bookingSummary && (
                  <div className="booking-summary">
                    <span>Total: {dashboardData.bookingSummary.total || 0}</span>
                    <span>•</span>
                    <span>Approved: {dashboardData.bookingSummary.paymentApproved || 0}</span>
                    <span>•</span>
                    <span>Rejected: {dashboardData.bookingSummary.paymentRejected || 0}</span>
                  </div>
                )}
              </div>
              {bookings.length > 0 ? (
                <div className="bookings-master-table">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="booking-card">
                      <div className="booking-card-header">
                        <h3>Booking #{booking.id.substring(0, 8)}</h3>
                        <span className={`status-badge ${booking.bookingStatus?.toLowerCase() || 'draft'}`}>
                          {booking.bookingStatus || 'DRAFT'}
                        </span>
                      </div>
                      
                      <div className="booking-details-grid">
                        <div className="booking-detail-item">
                          <label>User Name:</label>
                          <div>
                            <p><strong>{booking.userName}</strong></p>
                          </div>
                        </div>

                        <div className="booking-detail-item">
                          <label>Selected Location:</label>
                          <div>
                            <p><strong>{booking.locationName}</strong></p>
                            <p className="detail-subtext">{booking.locationCity}</p>
                          </div>
                        </div>

                        <div className="booking-detail-item">
                          <label>Event Timing:</label>
                          <div>
                            <p><strong>{booking.eventDateTime || booking.eventDateFormatted}</strong></p>
                            {booking.eventStartTimeFormatted && (
                              <p className="detail-subtext">{booking.eventTimeSlot}</p>
                            )}
                          </div>
                        </div>

                        <div className="booking-detail-item">
                          <label>Selected Template:</label>
                          <div>
                            <p><strong>{booking.templateName}</strong></p>
                            {booking.templateDescription && (
                              <p className="detail-subtext">{booking.templateDescription}</p>
                            )}
                          </div>
                        </div>

                        <div className="booking-detail-item full-width">
                          <label>Uploaded Media ({(() => {
                            if (booking.media && Array.isArray(booking.media)) return booking.media.length;
                            if (booking.allScheduleMedia && Array.isArray(booking.allScheduleMedia)) return booking.allScheduleMedia.length;
                            if (booking.mediaCount) return booking.mediaCount;
                            return 0;
                          })()}):</label>
                          <div className="booking-media-grid">
                            {(() => {
                              // Check for media array first (from admin endpoint or direct response)
                              let mediaItems = [];
                              
                              if (booking.media && Array.isArray(booking.media) && booking.media.length > 0) {
                                // Use media array directly
                                mediaItems = booking.media;
                              } else if (booking.allScheduleMedia && Array.isArray(booking.allScheduleMedia) && booking.allScheduleMedia.length > 0) {
                                // Use allScheduleMedia array
                                mediaItems = booking.allScheduleMedia;
                              } else {
                                // Fallback to single media item
                                mediaItems = [{
                                  id: booking.mediaId,
                                  filename: booking.mediaFilename,
                                  type: booking.mediaType,
                                  url: booking.mediaUrl,
                                  featureType: booking.mediaFeatureType,
                                  thumbnailUrl: booking.mediaThumbnailUrl
                                }];
                              }
                              
                              return mediaItems.map((mediaItem, idx) => (
                              <div key={mediaItem.id || idx} className="booking-media-item">
                                {mediaItem.type === 'IMAGE' || mediaItem.type === 'image' ? (
                                  <div className="media-preview-image">
                                    <img 
                                      src={mediaItem.thumbnailUrl || mediaItem.url} 
                                      alt={mediaItem.filename || 'Media'}
                                      className="media-thumbnail"
                                    />
                                    <a 
                                      href={mediaItem.url} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="media-view-link"
                                    >
                                      View
                                    </a>
                                  </div>
                                ) : (
                                  <div className="media-preview-video">
                                    {mediaItem.thumbnailUrl ? (
                                      <img 
                                        src={mediaItem.thumbnailUrl} 
                                        alt={mediaItem.filename || 'Video'}
                                        className="media-thumbnail"
                                      />
                                    ) : (
                                      <video 
                                        src={mediaItem.url} 
                                        className="media-video-preview"
                                        controls
                                      />
                                    )}
                                    <a 
                                      href={mediaItem.url} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="media-view-link"
                                    >
                                      View
                                    </a>
                                  </div>
                                )}
                                <div className="media-item-info">
                                  <p className="media-item-name"><strong>{mediaItem.filename || 'Media'}</strong></p>
                                  <p className="media-item-type">Type: {mediaItem.type}</p>
                                  {mediaItem.featureType && (
                                    <p className="media-item-feature" style={{ fontWeight: '600', color: 'rgba(132, 0, 255, 0.9)' }}>
                                      Content: {mediaItem.featureType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                    </p>
                                  )}
                                </div>
                              </div>
                              ));
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-content">
                  <p>No bookings yet. Create a booking to get started!</p>
                  <button className="btn btn-blue" onClick={() => navigate('/locations')}>
                    Start Booking
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
