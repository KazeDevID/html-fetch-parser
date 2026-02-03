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

  /**
   * Minify HTML
   * @param {string} html - HTML to minify
   * @returns {string} Minified HTML
   */
  static minifyHtml(html) {
    return html
      .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/>\s+</g, '><') // Remove spaces between tags
      .trim();
  }

  /**
   * Prettify HTML
   * @param {string} html - HTML to prettify
   * @param {number} indent - Indentation spaces (default: 2)
   * @returns {string} Prettified HTML
   */
  static prettifyHtml(html, indent = 2) {
    let formatted = '';
    let level = 0;
    const indentStr = ' '.repeat(indent);

    // Simple HTML prettifier
    const regex = /(<[^>]+>|[^<]+)/g;
    let match;

    while ((match = regex.exec(html)) !== null) {
      const content = match[1];

      if (content.startsWith('</')) {
        level--;
        formatted += indentStr.repeat(Math.max(0, level)) + content + '\n';
      } else if (content.startsWith('<') && !content.endsWith('/>')) {
        if (!content.includes('</')) {
          formatted += indentStr.repeat(level) + content;
          if (!content.match(/<(br|hr|img|input|meta|link)/i)) {
            level++;
            formatted += '\n';
          } else {
            formatted += '\n';
          }
        } else {
          formatted += content + '\n';
        }
      } else if (content.trim()) {
        formatted += content;
      }
    }

    return formatted.trim();
  }

  /**
   * Get heading hierarchy
   * @param {string} html - HTML string
   * @returns {Array<object>} Heading hierarchy
   */
  static getHeadingHierarchy(html) {
    const headings = [];
    const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h\1>/gi;
    let match;

    while ((match = headingRegex.exec(html)) !== null) {
      const level = parseInt(match[1]);
      const text = match[2].replace(/<[^>]+>/g, '').trim();

      headings.push({
        level,
        text,
        tag: `h${level}`
      });
    }

    return headings;
  }

  /**
   * Extract all attributes from elements
   * @param {string} html - HTML string
   * @param {string} selector - Element selector pattern
   * @returns {Array<object>} Elements with attributes
   */
  static extractAttributes(html, selector = '*') {
    const elements = [];
    const tagRegex = /<([a-z]+)([^>]*)>/gi;
    let match;

    while ((match = tagRegex.exec(html)) !== null) {
      const tag = match[1].toLowerCase();
      const attrStr = match[2];
      const attributes = {};

      // Parse attributes
      const attrRegex = /(\w+)(?:=["']([^"']*)?["'])?/g;
      let attrMatch;

      while ((attrMatch = attrRegex.exec(attrStr)) !== null) {
        attributes[attrMatch[1]] = attrMatch[2] || true;
      }

      elements.push({
        tag,
        attributes
      });
    }

    return elements;
  }

  /**
   * Count specific HTML elements
   * @param {string} html - HTML string
   * @param {Array<string>} tags - Tags to count
   * @returns {object} Count of each tag
   */
  static countElements(html, tags = []) {
    const counts = {};

    tags.forEach(tag => {
      const regex = new RegExp(`<${tag}[^>]*>`, 'gi');
      counts[tag] = (html.match(regex) || []).length;
    });

    return counts;
  }

  /**
   * Extract SEO meta information
   * @param {string} html - HTML string
   * @returns {object} SEO metadata
   */
  static extractSeoMeta(html) {
    const getSingleValue = (pattern) => {
      const match = html.match(pattern);
      return match ? match[1] : '';
    };

    return {
      title: getSingleValue(/<title[^>]*>(.*?)<\/title>/i),
      description: getSingleValue(/meta\s+name=["']description["']\s+content=["']([^"']*)/i) ||
                   getSingleValue(/meta\s+property=["']og:description["']\s+content=["']([^"']*)/i),
      keywords: getSingleValue(/meta\s+name=["']keywords["']\s+content=["']([^"']*)/i),
      ogTitle: getSingleValue(/meta\s+property=["']og:title["']\s+content=["']([^"']*)/i),
      ogImage: getSingleValue(/meta\s+property=["']og:image["']\s+content=["']([^"']*)/i),
      ogUrl: getSingleValue(/meta\s+property=["']og:url["']\s+content=["']([^"']*)/i)
    };
  }
}

module.exports = Manipulator;
