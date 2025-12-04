/**
 * Fixes R2 URLs that are missing the required /getvik-prod-files/ prefix
 * @param url The URL to check and fix
 * @returns The fixed URL
 */
export const fixR2Url = (url: string): string => {
  if (!url) return url;
  
  const incorrectPrefix = '/getvik-prod-files/';
  
  // If the URL contains the incorrect prefix, remove it
  if (url.includes(incorrectPrefix)) {
    return url.replace(incorrectPrefix, '/');
  }
  
  return url;
};
