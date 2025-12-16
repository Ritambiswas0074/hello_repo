import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthModal from '../components/AuthModal'
import api from '../services/api'
import '../App.css'
import './Schedule.css'

function Schedule() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedDays, setSelectedDays] = useState([])
  const [startTime, setStartTime] = useState('')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [timeError, setTimeError] = useState('')
  const locationId = localStorage.getItem('featureme_locationId')

  useEffect(() => {
    if (!user) {
      setShowAuthModal(true)
      return
    }
    if (!locationId) {
      navigate('/locations')
      return
    }
  }, [user, locationId, navigate])

  // Generate calendar days for current month
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()

  const days = []
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null)
  }
  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day)
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const handleDateClick = (day) => {
    if (day === null) return
    
    const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    if (selectedDays.includes(dateKey)) {
      setSelectedDays(selectedDays.filter(d => d !== dateKey))
      setSelectedDate(null)
    } else {
      // Only allow one date selection
      setSelectedDays([dateKey])
      setSelectedDate(dateKey)
    }
  }

  const isDateSelected = (day) => {
    if (day === null) return false
    const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return selectedDays.includes(dateKey)
  }

  const isDatePast = (day) => {
    if (day === null) return false
    const date = new Date(currentYear, currentMonth, day)
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    return date < todayDate
  }

  // Check if date is within 48 hours (minimum advance booking requirement)
  const isDateWithin48Hours = (day) => {
    if (day === null) return false
    const date = new Date(currentYear, currentMonth, day)
    const now = new Date()
    const minBookingTime = new Date(now.getTime() + (48 * 60 * 60 * 1000)) // 48 hours from now
    const dateStartOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const minBookingDate = new Date(minBookingTime.getFullYear(), minBookingTime.getMonth(), minBookingTime.getDate())
    
    // If the date is before the minimum booking date, it's within 48 hours
    return dateStartOfDay < minBookingDate
  }

  const handleConfirm = async () => {
    if (!user) {
      setShowAuthModal(true)
      return
    }

    if (!selectedDate || !locationId) {
      alert('Please select a date')
      return
    }

    if (!startTime) {
      setTimeError('Please select start time')
      return
    }

    setTimeError('')
    setLoading(true)

    try {
      // Convert date to ISO format
      const [year, month, day] = selectedDate.split('-')
      const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
      
      // Combine date with start time
      const [startHours, startMinutes] = startTime.split(':')
      
      const startDateTime = new Date(dateObj)
      startDateTime.setHours(parseInt(startHours), parseInt(startMinutes), 0, 0)

      // Check 48-hour minimum advance booking requirement
      const now = new Date()
      const minBookingTime = new Date(now.getTime() + (48 * 60 * 60 * 1000)) // 48 hours from now
      
      if (startDateTime < minBookingTime) {
        setTimeError(`Booking must be at least 48 hours in advance. The earliest available booking time is ${minBookingTime.toLocaleString()}`)
        setLoading(false)
        return
      }

      const scheduleData = {
        locationId,
        date: dateObj.toISOString(),
        startTime: startDateTime.toISOString(),
        // planId not required - will be set when plan is selected later
      }
      
      console.log('Creating schedule for user:', user.id, 'Date:', dateObj.toISOString(), 'Start Time:', startTime, 'Location:', locationId)
      
      // Save schedule to backend (this saves it for the current user)
      const response = await api.createSchedule(scheduleData)
      
      console.log('Schedule created successfully:', response.schedule.id)
      
      // Store schedule ID and date for booking flow
      localStorage.setItem('featureme_scheduleId', response.schedule.id)
      localStorage.setItem('featureme_scheduleDate', dateObj.toISOString())
      localStorage.setItem('featureme_scheduleStartTime', startDateTime.toISOString())
      // End time will be calculated and updated when plan is selected
      
      // Store formatted date for display
      localStorage.setItem('featureme_scheduleDateFormatted', selectedDate)
      
      console.log('Schedule saved for user:', user.id)
      console.log('Schedule ID:', response.schedule.id)
      
      // Navigate to Template page (next step)
      navigate('/template')
    } catch (error) {
      console.error('Error creating schedule:', error)
      let errorMessage = 'Failed to create schedule. Please try again.'
      
      // Extract error message from error object or data
      if (error.data) {
        errorMessage = error.data.message || error.data.error || errorMessage
      } else if (error.message) {
        errorMessage = error.message
      }
      
      // Check for 48-hour minimum error
      if (errorMessage.includes('48 hours')) {
        setTimeError(errorMessage)
        alert(errorMessage)
        setLoading(false)
        return
      }
      
      // Check if error has conflict information
      if (error.conflict || error.data?.conflict) {
        const conflict = error.conflict || error.data?.conflict
        const conflictMsg = errorMessage
        const bookedBy = conflict?.bookedBy ? ` by ${conflict.bookedBy}` : ''
        alert(`${conflictMsg}${bookedBy}\n\nThere must be at least 30 minutes between bookings. Please select a different time slot.`)
      } else {
        alert(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  if (!locationId) {
    return null // Will redirect
  }

  return (
    <div className="App">
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      <main className="page-container">
        <div className="page-content">
          <h1 className="page-title">
            <span className="gradient-magenta">Schedule</span>{' '}
            <span className="gradient-blue">Your Date</span>
          </h1>
          <p className="page-description">
            Select the date and start time for your billboard display. Duration will be determined when you select your plan.
            <br />
            <span style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)', display: 'block', marginTop: '0.5rem' }}>
              Note: Bookings must be made at least 48 hours in advance. There must be a 30-minute gap between bookings.
            </span>
          </p>

          <div className="schedule-section">
            <div className="calendar-container">
              <div className="calendar-header">
                <h2>{monthNames[currentMonth]} {currentYear}</h2>
              </div>
              
              <div className="calendar-grid">
                {dayNames.map(day => (
                  <div key={day} className="calendar-day-header">
                    {day}
                  </div>
                ))}
                
                {days.map((day, index) => {
                  const isPast = isDatePast(day)
                  const isWithin48Hours = isDateWithin48Hours(day)
                  const isDisabled = isPast || isWithin48Hours
                  
                  return (
                    <div
                      key={index}
                      className={`calendar-day ${day === null ? 'empty' : ''} ${isDateSelected(day) ? 'selected' : ''} ${isPast ? 'past' : ''} ${isWithin48Hours ? 'within-48-hours' : ''}`}
                      onClick={() => !isDisabled && handleDateClick(day)}
                      title={isWithin48Hours ? 'Booking must be at least 48 hours in advance' : ''}
                    >
                      {day}
                    </div>
                  )
                })}
              </div>
            </div>

            {selectedDate && (
              <div className="selected-dates">
                <h3>Selected Date:</h3>
                <div className="dates-list">
                  <span className="date-badge">
                    {new Date(selectedDate).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric',
                      weekday: 'long'
                    })}
                  </span>
                </div>

                <div className="time-selection" style={{ marginTop: '1.5rem' }}>
                  <h3 style={{ marginBottom: '1rem', color: '#ffffff' }}>Select Start Time:</h3>
                  
                  <div style={{ maxWidth: '300px' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                      Event Start Time <span style={{ color: '#ff6b6b' }}>*</span>
                    </label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => {
                        setStartTime(e.target.value)
                        setTimeError('')
                      }}
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '1rem',
                      }}
                    />
                    <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                      Duration will be set based on your selected plan (15s, 30s, or custom)
                    </p>
                  </div>

                  {timeError && (
                    <p style={{ color: '#ff6b6b', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                      {timeError}
                    </p>
                  )}

                  <p className="selection-hint" style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.85rem', marginTop: '0.75rem' }}>
                    ⚠️ Note: Time slots cannot overlap. If a time slot is already booked, please select a different time.
                  </p>
                </div>
              </div>
            )}

            <div className="action-buttons">
              <button 
                className="btn btn-blue" 
                onClick={handleConfirm}
                disabled={!selectedDate || !startTime || loading}
              >
                {loading ? 'Saving...' : 'Save Date & Time & Continue to Upload'}
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => navigate('/locations')}
                disabled={loading}
              >
                Back to Locations
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Schedule
