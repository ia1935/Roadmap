import { format } from 'date-fns';

// Convert date string to display format (shows only the date part)
export const formatDisplayDate = (dateString?: string) => {
  if (!dateString) return 'N/A';
  try {
    // Just use the standard Date constructor
    const date = new Date(dateString);
    // Use date-fns format to get consistent formatting
    return format(date, 'MMM dd, yyyy');
  } catch (e) {
    return 'Invalid date';
  }
};

// Format date for API submission - standardize with noon UTC time
export const formatDateForApi = (dateString?: string) => {
  if (!dateString) {
    // If no date provided, use current date at noon UTC
    const today = new Date();
    today.setUTCHours(12, 0, 0, 0);
    return today.toISOString();
  }

  try {
    // If we have just a date (YYYY-MM-DD), add the time component (noon UTC)
    if (!dateString.includes('T')) {
      // Parse the date components
      const [year, month, day] = dateString.split('-').map(Number);
      
      // Create a new date with noon UTC time
      const date = new Date();
      date.setUTCFullYear(year);
      date.setUTCMonth(month - 1); // months are 0-indexed
      date.setUTCDate(day);
      date.setUTCHours(12, 0, 0, 0); // Set to noon UTC
      
      return date.toISOString();
    }
    
    // If already has time component, use as is
    return new Date(dateString).toISOString();
  } catch (e) {
    console.error('Invalid date format:', dateString);
    // Return today at noon UTC as fallback
    const today = new Date();
    today.setUTCHours(12, 0, 0, 0);
    return today.toISOString();
  }
};

// Extract date only from ISO string for date input field
export const extractDateForInput = (isoDateString?: string) => {
  if (!isoDateString) return '';
  try {
    return isoDateString.split('T')[0]; // Extract YYYY-MM-DD portion
  } catch (e) {
    return '';
  }
};
