const Fetcher = require('./lib/fetcher');
const Parser = require('./lib/parser');
const Manipulator = require('./lib/manipulator');

class HtmlFetchParser {
  constructor(options = {}) {
    this.fetcher = new Fetcher(options);
    this.parser = new Parser();
  }

  async fetch(url, options = {}) {
    const html = await this.fetcher.get(url, options);
    this.parser.load(html);
    return this;
  }

  async post(url, data = {}, options = {}) {
    const html = await this.fetcher.post(url, data, options);
    this.parser.load(html);
    return this;
  }

  load(html) {
    this.parser.load(html);
    return this;
  }

  $(selector) {
    return this.parser.querySelector(selector);
  }

  $$(selector) {
    return this.parser.querySelectorAll(selector);
  }

  text(selector) {
    return this.parser.text(selector);
  }

  textAll(selector) {
    return this.parser.textAll(selector);
  }

  attr(selector, attr) {
    return this.parser.attr(selector, attr);
  }

  attrAll(selector, attr) {
    return this.parser.attrAll(selector, attr);
  }

  html(selector) {
    return this.parser.html(selector);
  }

  extract(schema) {
    return this.parser.extract(schema);
  }

  getTitle() {
    return this.parser.getTitle();
  }

  getMeta(name) {
    return this.parser.getMeta(name);
  }

  getLinks() {
    return this.parser.getLinks();
  }

  getImages() {
    return this.parser.getImages();
  }

  getRawHtml() {
    return this.parser.getRawHtml();
  }
}

module.exports = HtmlFetchParser;
module.exports.Fetcher = Fetcher;
module.exports.Parser = Parser;
module.exports.Manipulator = Manipulator;
module.exports.default = HtmlFetchParser;

module.exports.fetch = async (url, options) => {
  const instance = new HtmlFetchParser(options);
  return await instance.fetch(url);
};

module.exports.load = (html) => {
  const instance = new HtmlFetchParser();
  return instance.load(html);
};
