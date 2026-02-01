/**
 * HTML Manipulator Module
 * Utilities for HTML manipulation and transformation
 */

class Manipulator {
  /**
   * Remove HTML tags from text
   * @param {string} html - HTML string
   * @returns {string} Plain text
   */
  static stripTags(html) {
    return html.replace(/<[^>]*>/g, '');
  }

  /**
   * Decode HTML entities
   * @param {string} html - HTML string with entities
   * @returns {string} Decoded string
   */
  static decodeEntities(html) {
    const entities = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#039;': "'",
      '&apos;': "'",
      '&nbsp;': ' '
    };
    return html.replace(/&[#\w]+;/g, entity => entities[entity] || entity);
  }

  /**
   * Extract URLs from HTML
   * @param {string} html - HTML string
   * @param {string} baseUrl - Base URL for relative links
   * @returns {Array<string>} Array of URLs
   */
  static extractUrls(html, baseUrl = '') {
    const urlRegex = /https?:\/\/[^\s<>"]+/g;
    const urls = html.match(urlRegex) || [];
    return [...new Set(urls)];
  }

  /**
   * Clean whitespace
   * @param {string} text - Text to clean
   * @returns {string} Cleaned text
   */
  static cleanWhitespace(text) {
    return text
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n')
      .trim();
  }

  /**
   * Extract emails from HTML
   * @param {string} html - HTML string
   * @returns {Array<string>} Array of email addresses
   */
  static extractEmails(html) {
    const emailRegex = /[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+/g;
    const emails = html.match(emailRegex) || [];
    return [...new Set(emails)];
  }

  /**
   * Truncate text
   * @param {string} text - Text to truncate
   * @param {number} length - Max length
   * @param {string} suffix - Suffix (default: '...')
   * @returns {string} Truncated text
   */
  static truncate(text, length, suffix = '...') {
    if (text.length <= length) return text;
    return text.substring(0, length - suffix.length) + suffix;
  }

  /**
   * Convert relative URL to absolute
   * @param {string} url - Relative URL
   * @param {string} baseUrl - Base URL
   * @returns {string} Absolute URL
   */
  static toAbsoluteUrl(url, baseUrl) {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;

    try {
      return new URL(url, baseUrl).href;
    } catch {
      return url;
    }
  }

  /**
   * Extract structured data (JSON-LD, microdata)
   * @param {string} html - HTML string
   * @returns {Array<object>} Array of structured data objects
   */
  static extractStructuredData(html) {
    const jsonLdRegex = /<script[^>]+type=["']application\/ld\+json["'][^>]*>(.*?)<\/script>/gis;
    const matches = [...html.matchAll(jsonLdRegex)];

    return matches
      .map(match => {
        try {
          return JSON.parse(match[1]);
        } catch {
          return null;
        }
      })
      .filter(Boolean);
  }

  /**
   * Remove scripts and styles
   * @param {string} html - HTML string
   * @returns {string} Cleaned HTML
   */
  static removeScriptsAndStyles(html) {
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  }

  /**
   * Get word count
   * @param {string} text - Text to count
   * @returns {number} Word count
   */
  static wordCount(text) {
    return text.trim().split(/\s+/).filter(Boolean).length;
  }

  /**
   * Sanitize filename
   * @param {string} filename - Filename to sanitize
   * @returns {string} Safe filename
   */
  static sanitizeFilename(filename) {
    return filename
      .replace(/[^a-z0-9.-]/gi, '_')
      .replace(/_+/g, '_')
      .toLowerCase();
  }
}

module.exports = Manipulator;
