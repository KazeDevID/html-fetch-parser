/**
 * HTML Validator Module
 * Validate HTML structure, URLs, and data
 */

class Validator {
  /**
   * Validate if string is valid HTML
   * @param {string} html - HTML string to validate
   * @returns {boolean} True if valid HTML
   */
  static isValidHtml(html) {
    if (typeof html !== 'string') return false;
    try {
      const openTags = (html.match(/<[^/>]+>/g) || []).length;
      const closeTags = (html.match(/<\/[^>]+>/g) || []).length;
      return openTags >= 0 && closeTags >= 0;
    } catch {
      return false;
    }
  }

  /**
   * Validate if string is valid URL
   * @param {string} url - URL to validate
   * @returns {boolean} True if valid URL
   */
  static isValidUrl(url) {
    if (typeof url !== 'string') return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} True if valid email
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate CSS selector
   * @param {string} selector - CSS selector to validate
   * @returns {boolean} True if valid selector
   */
  static isValidSelector(selector) {
    if (typeof selector !== 'string') return false;
    try {
      document.createDocumentFragment().querySelector(selector);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if HTML contains malicious scripts
   * @param {string} html - HTML string
   * @returns {boolean} True if suspicious content found
   */
  static hasMaliciousContent(html) {
    const suspiciousPatterns = [
      /<script[^>]*>[\s\S]*?<\/script>/gi,
      /on\w+\s*=\s*["'][^"']*["']/gi,
      /javascript:/gi,
      /eval\(/gi,
      /expression\s*\(/gi
    ];
    return suspiciousPatterns.some(pattern => pattern.test(html));
  }

  /**
   * Validate if element has required attributes
   * @param {object} element - DOM element
   * @param {Array<string>} requiredAttrs - Required attributes
   * @returns {boolean} True if has all required attributes
   */
  static hasRequiredAttributes(element, requiredAttrs) {
    if (!element || !Array.isArray(requiredAttrs)) return false;
    return requiredAttrs.every(attr => element.getAttribute(attr) !== null);
  }

  /**
   * Validate HTML structure completeness
   * @param {string} html - HTML string
   * @returns {object} Validation result with details
   */
  static validateStructure(html) {
    const issues = [];

    if (!html.toLowerCase().includes('<html')) {
      issues.push('Missing <html> tag');
    }
    if (!html.toLowerCase().includes('<head')) {
      issues.push('Missing <head> tag');
    }
    if (!html.toLowerCase().includes('<body')) {
      issues.push('Missing <body> tag');
    }
    if (!html.toLowerCase().includes('<title')) {
      issues.push('Missing <title> tag');
    }

    const hasProperEncoding = html.toLowerCase().includes('utf-8') || 
                              html.toLowerCase().includes('charset');
    if (!hasProperEncoding) {
      issues.push('Missing character encoding declaration');
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  }

  /**
   * Get HTML metadata
   * @param {string} html - HTML string
   * @returns {object} Metadata about HTML
   */
  static getMetadata(html) {
    if (!this.isValidHtml(html)) {
      throw new Error('Invalid HTML');
    }

    return {
      size: html.length,
      tags: (html.match(/<[a-z][a-z0-9]*[^>]*>/gi) || []).length,
      links: (html.match(/<a[^>]*>/gi) || []).length,
      images: (html.match(/<img[^>]*>/gi) || []).length,
      forms: (html.match(/<form[^>]*>/gi) || []).length,
      scripts: (html.match(/<script[^>]*>/gi) || []).length,
      styles: (html.match(/<style[^>]*>/gi) || []).length,
      hasMaliciousContent: this.hasMaliciousContent(html)
    };
  }
}

module.exports = Validator;
