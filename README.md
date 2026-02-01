# HTML Fetch Parser

Lightweight and powerful HTML fetching, parsing, and manipulation library for Node.js. Combines the best features of fetch, axios, and cheerio in one simple package.

## Features

- **Easy HTML Fetching** - Built-in HTTP client with timeout support
- **Powerful Parsing** - CSS selector-based HTML parsing
- **Simple API** - Intuitive chainable methods
- **Zero Heavy Dependencies** - Uses lightweight `node-html-parser`
- **TypeScript Support** - Full TypeScript definitions included
- **Utility Functions** - HTML manipulation helpers built-in

## Installation

```bash
npm install html-fetch-parser
```

## Quick Start

### Fetch and Parse Remote HTML

```javascript
const { fetch } = require('html-fetch-parser');

const parser = await fetch('https://example.com');
console.log(parser.getTitle());
console.log(parser.text('h1'));
console.log(parser.getLinks());
```

### Load and Parse Local HTML

```javascript
const HtmlFetchParser = require('html-fetch-parser');

const html = '<h1>Hello World</h1><p>Welcome</p>';
const parser = new HtmlFetchParser();
parser.load(html);

console.log(parser.text('h1'));
```

## API Reference

### Main Class

#### `new HtmlFetchParser(options)`

Create a new instance.

**Options:**
- `headers` - Default HTTP headers
- `timeout` - Request timeout in milliseconds (default: 10000)

#### Methods

**Fetching:**
- `fetch(url, options)` - Fetch HTML from URL
- `post(url, data, options)` - POST request
- `load(html)` - Load HTML string

**Querying:**
- `$(selector)` - Get single element (alias for querySelector)
- `$$(selector)` - Get all elements (alias for querySelectorAll)
- `text(selector)` - Get text content
- `textAll(selector)` - Get all text contents
- `attr(selector, attr)` - Get attribute value
- `attrAll(selector, attr)` - Get all attribute values
- `html(selector)` - Get inner HTML

**Data Extraction:**
- `extract(schema)` - Extract data using schema
- `getTitle()` - Get page title
- `getMeta(name)` - Get meta tag content
- `getLinks()` - Get all links
- `getImages()` - Get all images
- `getRawHtml()` - Get raw HTML string

### Extract Schema

Extract structured data easily:

```javascript
const data = parser.extract({
  title: 'h1',
  description: '.intro',
  links: {
    selector: 'a',
    attr: 'href',
    multiple: true
  },
  prices: {
    selector: '.price',
    multiple: true,
    transform: (value) => parseFloat(value.replace('$', ''))
  }
});
```

**Schema Options:**
- `selector` (required) - CSS selector
- `attr` - Attribute name to extract
- `multiple` - Extract from all matching elements
- `transform` - Transform function

### Manipulator Class

Static utility methods for HTML manipulation:

```javascript
const { Manipulator } = require('html-fetch-parser');

Manipulator.stripTags(html);
Manipulator.decodeEntities(html);
Manipulator.extractUrls(html, baseUrl);
Manipulator.extractEmails(html);
Manipulator.cleanWhitespace(text);
Manipulator.truncate(text, length, suffix);
Manipulator.toAbsoluteUrl(url, baseUrl);
Manipulator.removeScriptsAndStyles(html);
Manipulator.wordCount(text);
Manipulator.sanitizeFilename(filename);
Manipulator.extractStructuredData(html);
```

## Examples

### Basic Usage

```javascript
const HtmlFetchParser = require('html-fetch-parser');

const html = `
  <div>
    <h1>Products</h1>
    <div class="product">
      <h2>Product 1</h2>
      <span class="price">$19.99</span>
    </div>
    <div class="product">
      <h2>Product 2</h2>
      <span class="price">$29.99</span>
    </div>
  </div>
`;

const parser = new HtmlFetchParser();
parser.load(html);

const products = parser.extract({
  title: 'h1',
  products: {
    selector: '.product h2',
    multiple: true
  },
  prices: {
    selector: '.price',
    multiple: true
  }
});

console.log(products);
```

### Fetch Remote HTML

```javascript
const { fetch } = require('html-fetch-parser');

async function scrapeWebsite() {
  const parser = await fetch('https://example.com', {
    headers: {
      'User-Agent': 'My Scraper Bot'
    }
  });

  const data = parser.extract({
    title: 'h1',
    description: 'meta[name="description"]',
    links: {
      selector: 'a',
      attr: 'href',
      multiple: true
    }
  });

  return data;
}
```

### Custom Fetcher

```javascript
const { Fetcher } = require('html-fetch-parser');

const fetcher = new Fetcher({
  timeout: 5000,
  headers: {
    'User-Agent': 'Custom Bot'
  }
});

const html = await fetcher.get('https://example.com');
```

### HTML Manipulation

```javascript
const { Manipulator, load } = require('html-fetch-parser');

const html = '<p>Hello &amp; welcome!</p>';

const clean = Manipulator.decodeEntities(html);
const text = Manipulator.stripTags(clean);
const truncated = Manipulator.truncate(text, 10);

console.log(truncated);
```

## Advanced Usage

### Chaining Methods

```javascript
const data = await fetch('https://example.com')
  .then(parser => parser.extract({
    title: 'h1',
    content: '.content'
  }));
```

### Error Handling

```javascript
try {
  const parser = await fetch('https://example.com');
  console.log(parser.getTitle());
} catch (error) {
  console.error('Failed to fetch:', error.message);
}
```

### Custom Timeout

```javascript
const parser = new HtmlFetchParser({ timeout: 30000 });
await parser.fetch('https://slow-website.com');
```

## TypeScript

Full TypeScript support included:

```typescript
import HtmlFetchParser, { fetch, Manipulator } from 'html-fetch-parser';

const parser: HtmlFetchParser = await fetch('https://example.com');
const title: string = parser.getTitle();
```

## Performance

- Lightweight with minimal dependencies
- Fast HTML parsing using node-html-parser
- Native fetch API for HTTP requests
- Memory efficient

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue on GitHub.
