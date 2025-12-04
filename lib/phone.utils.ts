/**
 * Phone number validation and formatting utilities
 * Supports Indian phone numbers (10 digits starting with 6-9)
 */

export interface PhoneValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates Indian phone number format
 * @param phone - Phone number string to validate
 * @returns Validation result with error message if invalid
 */
export function validatePhoneNumber(phone: string): PhoneValidationResult {
  if (!phone || phone.trim() === '') {
    return {
      isValid: false,
      error: 'Phone number is required',
    };
  }

  const trimmedPhone = phone.trim();

  // Check for Indian phone number (10 digits starting with 6-9)
  const indianPhoneRegex = /^[6-9]\d{9}$/;
  
  // Check for International phone number (E.164 format: +<country_code><number>)
  // Min length 7 (e.g. +1-234-567), Max length 15 (ITU standard)
  const internationalPhoneRegex = /^\+[1-9]\d{6,14}$/;

  if (indianPhoneRegex.test(trimmedPhone)) {
    return { isValid: true };
  }

  if (internationalPhoneRegex.test(trimmedPhone)) {
    return { isValid: true };
  }

  return {
    isValid: false,
    error: 'Phone number must be a valid 10-digit Indian mobile number or a supported international number starting with +',
  };
}

/**
 * Formats phone number for display
 * @param phone - Phone number string
 * @returns Formatted phone number (e.g., "98765 43210")
 */
export function formatPhoneNumber(phone: string): string {
  if (!phone) return '';
  
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  
  return phone;
}

/**
 * Cleans phone number input (removes non-digits)
 * @param phone - Phone number string
 * @returns Cleaned phone number with only digits
 */
export function cleanPhoneNumber(phone: string): string {
  // Allow + at the start, remove all other non-digits
  if (phone.startsWith('+')) {
    return '+' + phone.replace(/\D/g, '');
  }
  return phone.replace(/\D/g, '');
}
