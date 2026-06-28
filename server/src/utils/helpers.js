const slugifyLib = require('slugify');

/**
 * Generate a URL-friendly slug from a string
 */
const generateSlug = (text) => {
  return slugifyLib(text, {
    lower: true,
    strict: true,
    trim: true,
  });
};

/**
 * Generate a unique slug by appending a random suffix
 */
const generateUniqueSlug = (text) => {
  const base = generateSlug(text);
  const suffix = Math.random().toString(36).substring(2, 7);
  return `${base}-${suffix}`;
};

/**
 * Estimate reading time in minutes from HTML or plain text content
 */
const calculateReadingTime = (content) => {
  if (!content) return 1;
  const text = content.replace(/<[^>]*>/g, '');
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return Math.max(1, minutes);
};

module.exports = { generateSlug, generateUniqueSlug, calculateReadingTime };
