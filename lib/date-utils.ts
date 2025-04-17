import { DateTime } from "luxon"

// Format a date string from ISO to a human-readable format
export function formatDate(dateString: string): string {
  return DateTime.fromISO(dateString).toLocaleString(DateTime.DATE_FULL)
}

// Format a date for input fields (YYYY-MM-DD)
export function formatDateForInput(dateString: string): string {
  return DateTime.fromISO(dateString).toFormat("yyyy-MM-dd")
}

// Convert a date from input format to ISO format for API
export function formatDateForApi(dateString: string): string {
  return DateTime.fromFormat(dateString, "yyyy-MM-dd").toISO()
}
