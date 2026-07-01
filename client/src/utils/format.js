/**
 * Format date to Indonesian locale
 * @param {string|Date} dateString 
 * @param {Object} options 
 * @returns {string}
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return '-';
  
  const defaultOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  
  return new Date(dateString).toLocaleDateString('id-ID', { ...defaultOptions, ...options });
};

/**
 * Get full image URL from Cloudinary or default relative path
 * @param {string} url 
 * @returns {string}
 */
export const getImageUrl = (url) => {
  if (!url) return '/placeholder-image.jpg';
  
  if (url.startsWith('http')) {
    // Inject Cloudinary optimization flags if it's a Cloudinary URL
    if (url.includes('cloudinary.com') && !url.includes('q_auto')) {
      return url.replace('/upload/', '/upload/q_auto,f_auto/');
    }
    return url;
  }
  
  return '/placeholder-image.jpg';
};
