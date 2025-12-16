import { useState } from 'react'
import './ScheduleModal.css'

function ScheduleModal({ onClose, onConfirm }) {
  const [selectedDays, setSelectedDays] = useState([])

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
    
    const dateKey = `${currentYear}-${currentMonth + 1}-${day}`
    if (selectedDays.includes(dateKey)) {
      setSelectedDays(selectedDays.filter(d => d !== dateKey))
    } else {
      setSelectedDays([...selectedDays, dateKey])
    }
  }

  const isDateSelected = (day) => {
    if (day === null) return false
    const dateKey = `${currentYear}-${currentMonth + 1}-${day}`
    return selectedDays.includes(dateKey)
  }

  const isDatePast = (day) => {
    if (day === null) return false
    const date = new Date(currentYear, currentMonth, day)
    return date < new Date(today.getFullYear(), today.getMonth(), today.getDate())
  }

  const handleConfirm = () => {
    if (selectedDays.length > 0 && onConfirm) {
      // Convert the first selected date to ISO format for backend
      const firstDate = selectedDays.sort()[0]
      const [year, month, day] = firstDate.split('-')
      const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
      const isoDate = dateObj.toISOString()
      onConfirm(isoDate)
    }
    onClose()
  }

  return (
    <div className="schedule-modal-overlay" onClick={onClose}>
      <div className="schedule-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="schedule-modal-close" onClick={onClose}>×</button>
        <h2 className="schedule-modal-title">
          <span className="gradient-magenta">Schedule</span>{' '}
          <span className="gradient-blue">Your Dates</span>
        </h2>
        <p className="schedule-modal-description">
          Select the dates you want your content to be displayed on the billboard
        </p>

        <div className="schedule-modal-calendar">
          <div className="calendar-header">
            <h3>{monthNames[currentMonth]} {currentYear}</h3>
          </div>
          
          <div className="calendar-grid">
            {dayNames.map(day => (
              <div key={day} className="calendar-day-header">
                {day}
              </div>
            ))}
            
            {days.map((day, index) => (
              <div
                key={index}
                className={`calendar-day ${day === null ? 'empty' : ''} ${isDateSelected(day) ? 'selected' : ''} ${isDatePast(day) ? 'past' : ''}`}
                onClick={() => !isDatePast(day) && handleDateClick(day)}
              >
                {day}
              </div>
            ))}
          </div>
        </div>

        {selectedDays.length > 0 && (
          <div className="selected-dates">
            <h3>Selected Dates:</h3>
            <div className="dates-list">
              {selectedDays.sort().map((date, index) => (
                <span key={index} className="date-badge">
                  {new Date(date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="schedule-modal-actions">
          <button className="btn btn-purple" onClick={handleConfirm} disabled={selectedDays.length === 0}>
            Confirm Schedule
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default ScheduleModal

