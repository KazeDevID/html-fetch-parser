/**
 * HTTP Fetcher Module
 * Lightweight HTTP client for fetching HTML content
 */

class Fetcher {
  constructor(options = {}) {
    this.defaultHeaders = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      ...options.headers
    };
    this.timeout = options.timeout || 10000;
  }

  /**
   * Fetch HTML content from URL
   * @param {string} url - URL to fetch
   * @param {object} options - Fetch options
   * @returns {Promise<string>} HTML content
   */
  async get(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: { ...this.defaultHeaders, ...options.headers },
        signal: controller.signal,
        ...options
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      return await response.text();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error(`Request timeout after ${this.timeout}ms`);
      }
      throw error;
    }
  }

  /**
   * POST request with data
   * @param {string} url - URL to post
   * @param {object} data - Data to send
   * @param {object} options - Fetch options
   * @returns {Promise<string>} Response content
   */
  async post(url, data = {}, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.defaultHeaders,
          ...options.headers
        },
        body: JSON.stringify(data),
        signal: controller.signal,
        ...options
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      return await response.text();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error(`Request timeout after ${this.timeout}ms`);
      }
      throw error;
    }
  }

  /**
   * Set default headers
   * @param {object} headers - Headers object
   */
  setHeaders(headers) {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers };
  }

  /**
   * Set timeout
   * @param {number} ms - Timeout in milliseconds
   */
  setTimeout(ms) {
    this.timeout = ms;
  }
}

module.exports = Fetcher;
