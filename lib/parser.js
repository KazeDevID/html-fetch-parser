/**
 * HTML Parser Module
 * Parse and query HTML content
 */

const { parse } = require('node-html-parser');

class Parser {
  constructor(html = '') {
    this.root = html ? parse(html) : null;
    this.rawHtml = html;
  }

  /**
   * Load HTML content
   * @param {string} html - HTML string
   * @returns {Parser} Parser instance
   */
  load(html) {
    this.rawHtml = html;
    this.root = parse(html);
    return this;
  }

  /**
   * Find element by CSS selector
   * @param {string} selector - CSS selector
   * @returns {object|null} Element
   */
  querySelector(selector) {
    if (!this.root) return null;
    return this.root.querySelector(selector);
  }

  /**
   * Find all elements by CSS selector
   * @param {string} selector - CSS selector
   * @returns {Array} Array of elements
   */
  querySelectorAll(selector) {
    if (!this.root) return [];
    return this.root.querySelectorAll(selector);
  }

  /**
   * Get element text content
   * @param {string} selector - CSS selector
   * @returns {string} Text content
   */
  text(selector) {
    const element = this.querySelector(selector);
    return element ? element.text.trim() : '';
  }

  /**
   * Get all text from elements
   * @param {string} selector - CSS selector
   * @returns {Array<string>} Array of text content
   */
  textAll(selector) {
    const elements = this.querySelectorAll(selector);
    return elements.map(el => el.text.trim()).filter(text => text);
  }

  /**
   * Get element attribute
   * @param {string} selector - CSS selector
   * @param {string} attr - Attribute name
   * @returns {string|null} Attribute value
   */
  attr(selector, attr) {
    const element = this.querySelector(selector);
    return element ? element.getAttribute(attr) : null;
  }

  /**
   * Get attributes from all matching elements
   * @param {string} selector - CSS selector
   * @param {string} attr - Attribute name
   * @returns {Array<string>} Array of attribute values
   */
  attrAll(selector, attr) {
    const elements = this.querySelectorAll(selector);
    return elements.map(el => el.getAttribute(attr)).filter(val => val);
  }

  /**
   * Get element HTML
   * @param {string} selector - CSS selector
   * @returns {string} HTML content
   */
  html(selector) {
    const element = this.querySelector(selector);
    return element ? element.innerHTML : '';
  }

  /**
   * Get outer HTML
   * @param {string} selector - CSS selector
   * @returns {string} Outer HTML
   */
  outerHtml(selector) {
    const element = this.querySelector(selector);
    return element ? element.outerHTML : '';
  }

  /**
   * Get page title
   * @returns {string} Page title
   */
  getTitle() {
    return this.text('title');
  }

  /**
   * Get meta tags
   * @param {string} name - Meta name or property
   * @returns {string} Meta content
   */
  getMeta(name) {
    const meta = this.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
    return meta ? meta.getAttribute('content') : '';
  }

  /**
   * Get all links
   * @returns {Array<object>} Array of links with text and href
   */
  getLinks() {
    const links = this.querySelectorAll('a');
    return links.map(link => ({
      text: link.text.trim(),
      href: link.getAttribute('href'),
      title: link.getAttribute('title')
    }));
  }

  /**
   * Get all images
   * @returns {Array<object>} Array of images with src and alt
   */
  getImages() {
    const images = this.querySelectorAll('img');
    return images.map(img => ({
      src: img.getAttribute('src'),
      alt: img.getAttribute('alt'),
      title: img.getAttribute('title')
    }));
  }

  /**
   * Extract data using custom mapping
   * @param {object} schema - Extraction schema
   * @returns {object} Extracted data
   */
  extract(schema) {
    const result = {};

    for (const [key, config] of Object.entries(schema)) {
      if (typeof config === 'string') {
        // Simple selector
        result[key] = this.text(config);
      } else if (typeof config === 'object') {
        // Advanced config
        const { selector, attr, multiple, transform } = config;

        if (multiple) {
          result[key] = attr
            ? this.attrAll(selector, attr)
            : this.textAll(selector);
        } else {
          result[key] = attr
            ? this.attr(selector, attr)
            : this.text(selector);
        }

        // Apply transform function if provided
        if (transform && typeof transform === 'function') {
          result[key] = transform(result[key]);
        }
      }
    }

    return result;
  }

  /**
   * Get raw HTML
   * @returns {string} Raw HTML
   */
  getRawHtml() {
    return this.rawHtml;
  }
}

module.exports = Parser;
