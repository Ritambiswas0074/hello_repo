/**
 * Date formatting utilities
 * Ensures consistent date formatting regardless of server timezone
 */

/**
 * Format a date to a readable string (e.g., "Monday, December 22, 2025")
 * Uses UTC to ensure consistent formatting across different server timezones
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  // Use UTC methods to ensure consistent formatting
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  const dayName = days[d.getUTCDay()];
  const monthName = months[d.getUTCMonth()];
  const day = d.getUTCDate();
  const year = d.getUTCFullYear();
  
  return `${dayName}, ${monthName} ${day}, ${year}`;
}

/**
 * Format a time to a readable string (e.g., "10:15 PM")
 * Uses UTC to ensure consistent formatting across different server timezones
 */
export function formatTime(date: Date | string | null): string | null {
  if (!date) return null;
  
  const d = typeof date === 'string' ? new Date(date) : date;
  
  // Use UTC methods
  let hours = d.getUTCHours();
  const minutes = d.getUTCMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12
  
  const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
  
  return `${hours}:${minutesStr} ${ampm}`;
}

/**
 * Format date and time together (e.g., "Monday, December 22, 2025 at 10:15 PM")
 */
export function formatDateTime(date: Date | string, time: Date | string | null): string {
  const formattedDate = formatDate(date);
  const formattedTime = formatTime(time);
  
  return formattedTime ? `${formattedDate} at ${formattedTime}` : formattedDate;
}
