# html-fetch-parser

A lightweight, powerful library for fetching, parsing, and manipulating HTML content in JavaScript/Node.js. Combines HTTP fetching, HTML parsing, and advanced data extraction in one simple package.

## Features

- **Lightweight** - Minimal dependencies (only `node-html-parser`)
- **Easy to Use** - Chainable API with jQuery-like selectors
- **Powerful Parsing** - Extract data with custom schemas
- **HTML Manipulation** - Utilities for cleaning, minifying, and transforming HTML
- **Form Parsing** - Automatically parse forms into structured data
- **Table Parsing** - Extract and manipulate HTML tables
- **Validation** - Validate HTML, URLs, emails, and more
- **Data Extraction** - Built-in methods for links, images, meta tags, and structured data
- **Security** - Detect malicious content and sanitize data

## Installation

```bash
npm install html-fetch-parser
```

## Quick Start

### Basic Usage

```javascript
const HtmlFetchParser = require('html-fetch-parser');

// Fetch and parse in one go
const parser = await HtmlFetchParser.fetch('https://example.com');

// Query elements (jQuery-like)
const title = parser.text('h1');
const links = parser.$('a'); // Single element
const allLinks = parser.$$('a'); // All elements

// Get common data
const pageTitle = parser.getTitle();
const images = parser.getImages();
const metadata = parser.extract({
  title: 'h1',
  description: 'meta[name="description"]'
});
```

### Load Local HTML

```javascript
const parser = new HtmlFetchParser();
parser.load('<html><body><h1>Hello</h1></body></html>');

const heading = parser.text('h1'); // 'Hello'
```

### POST Requests

```javascript
const parser = await new HtmlFetchParser().post('https://example.com/api', {
  name: 'John',
  email: 'john@example.com'
});
```

## API Documentation

### HtmlFetchParser (Main Class)

#### Constructor
```javascript
const parser = new HtmlFetchParser(options);
```

**Options:**
- `headers` (object) - Default HTTP headers
- `timeout` (number) - Request timeout in ms (default: 10000)

#### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `fetch(url, options)` | Promise | Fetch and parse HTML from URL |
| `post(url, data, options)` | Promise | POST request and parse response |
| `load(html)` | this | Load and parse HTML string |
| `$(selector)` | Element | Find single element by selector |
| `$$(selector)` | Array | Find all elements by selector |
| `text(selector)` | string | Get text content |
| `textAll(selector)` | Array | Get text from all matching elements |
| `attr(selector, attr)` | string | Get attribute value |
| `attrAll(selector, attr)` | Array | Get attributes from all elements |
| `html(selector)` | string | Get inner HTML |
| `extract(schema)` | object | Extract data using custom schema |
| `getTitle()` | string | Get page title |
| `getMeta(name)` | string | Get meta tag content |
| `getLinks()` | Array | Get all links with href and text |
| `getImages()` | Array | Get all images with src and alt |
| `getRawHtml()` | string | Get raw HTML content |

### Parser Class

Low-level HTML parsing with CSS selectors.

```javascript
const { Parser } = require('html-fetch-parser');
const parser = new Parser(html);

parser.querySelector('h1');
parser.querySelectorAll('p');
parser.text('h1');
parser.outerHtml('div');
```

### Manipulator Class

HTML transformation and data extraction utilities.

```javascript
const { Manipulator } = require('html-fetch-parser');

// String operations
Manipulator.stripTags('<p>Hello</p>'); // 'Hello'
Manipulator.decodeEntities('&lt;div&gt;'); // '<div>'
Manipulator.minifyHtml(html); // Minified HTML
Manipulator.prettifyHtml(html, 2); // Prettified HTML

// Data extraction
Manipulator.extractUrls(html);
Manipulator.extractEmails(html);
Manipulator.extractStructuredData(html); // JSON-LD data
Manipulator.extractSeoMeta(html); // SEO metadata

// Text utilities
Manipulator.cleanWhitespace(text);
Manipulator.truncate(text, 100);
Manipulator.wordCount(text);

// HTML utilities
Manipulator.removeScriptsAndStyles(html);
Manipulator.toAbsoluteUrl(relativeUrl, baseUrl);
Manipulator.sanitizeFilename(filename);
Manipulator.getHeadingHierarchy(html); // H1, H2, H3 structure
Manipulator.countElements(html, ['p', 'a', 'img']); // Count specific tags
```

### Validator Class

Validate HTML, URLs, emails, and detect security issues.

```javascript
const { Validator } = require('html-fetch-parser');

// URL & Email validation
Validator.isValidUrl('https://example.com'); // true
Validator.isValidEmail('john@example.com'); // true

// HTML validation
Validator.isValidHtml(htmlString); // true
Validator.isValidSelector('h1.title'); // true

// Security checks
Validator.hasMaliciousContent(html); // Detects XSS, eval, etc.
Validator.validateStructure(html); // Check for required tags

// Metadata
Validator.getMetadata(html); // { size, tags, links, images, forms, scripts, styles, hasMaliciousContent }
```

### TableParser Class

Parse HTML tables into structured data.

```javascript
const { TableParser } = require('html-fetch-parser');

// Parse single table or all tables
const tableData = TableParser.parseTable(tableElement);
const allTables = TableParser.parseTables(htmlRoot);

// tableData structure:
// {
//   headers: ['Name', 'Age', 'City'],
//   rows: [{ Name: 'John', Age: '28', City: 'NYC' }, ...],
//   rowCount: 3,
//   columnCount: 3
// }

// Convert formats
TableParser.tableToCSV(tableData); // CSV string
TableParser.tableToJSON(tableData); // JSON string

// Query operations
TableParser.search(tableData, 'John', ['Name', 'City']); // Search rows
TableParser.filter(tableData, row => row.Age > 25); // Filter
TableParser.sort(tableData, 'Age', 'asc'); // Sort by column
```

### FormParser Class

Parse HTML forms and validate form data.

```javascript
const { FormParser } = require('html-fetch-parser');

// Parse single form or all forms
const formData = FormParser.parseForm(formElement);
const allForms = FormParser.parseForms(htmlRoot);

// formData structure:
// {
//   action: '/submit',
//   method: 'POST',
//   fields: [
//     { name: 'email', type: 'email', required: true, ... },
//     { name: 'country', type: 'select', options: [...] }
//   ],
//   fieldCount: 2
// }

// Form utilities
FormParser.getField(formData, 'email'); // Get field config
FormParser.getRequiredFields(formData); // Required fields only
FormParser.generateTemplate(formData); // Empty form template

// Validation
const errors = FormParser.validate(formData, {
  email: 'john@example.com',
  country: 'US'
});
// Returns: { isValid: true/false, errors: [...] }

// JSON Schema
FormParser.toJsonSchema(formData); // Generate JSON Schema
```

## Advanced Examples

### Data Extraction with Schema

```javascript
const parser = await HtmlFetchParser.fetch('https://example.com');

const data = parser.extract({
  title: 'h1',
  description: {
    selector: 'meta[name="description"]',
    attr: 'content'
  },
  tags: {
    selector: 'a.tag',
    multiple: true,
    transform: tags => tags.map(t => t.toLowerCase())
  }
});
```

### Complex Scraping

```javascript
const parser = await HtmlFetchParser.fetch('https://example.com');
const { TableParser, FormParser, Validator } = require('html-fetch-parser');

// Validate page
if (!Validator.hasMaliciousContent(parser.getRawHtml())) {
  // Parse tables
  const tables = TableParser.parseTables(parser.getRawHtml());
  
  // Parse forms
  const forms = FormParser.parseForms(parser.getRawHtml());
  
  // Extract all data
  const result = {
    title: parser.getTitle(),
    tables: tables,
    forms: forms,
    images: parser.getImages(),
    links: parser.getLinks()
  };
}
```

### Table Data Processing

```javascript
const { TableParser } = require('html-fetch-parser');

const tableData = TableParser.parseTable(tableElement);

// Search
const results = TableParser.search(tableData, 'New York');

// Sort
const sorted = TableParser.sort(tableData, 'Age', 'desc');

// Export
const csv = TableParser.tableToCSV(sorted);
const json = TableParser.tableToJSON(sorted);
```

### Form Validation

```javascript
const { FormParser } = require('html-fetch-parser');

const formData = FormParser.parseForm(formElement);
const formValues = {
  email: 'john@example.com',
  phone: '123456',
  message: 'Hi'
};

const validation = FormParser.validate(formData, formValues);
if (!validation.isValid) {
  console.log('Errors:', validation.errors);
  // ['phone must match required pattern', 'message must be at least 10 characters']
}
```

### HTML Cleanup and Minification

```javascript
const { Manipulator } = require('html-fetch-parser');

// Minify HTML
const minified = Manipulator.minifyHtml(html);

// Remove scripts and styles
const clean = Manipulator.removeScriptsAndStyles(html);

// Get SEO metadata
const seo = Manipulator.extractSeoMeta(html);
console.log(seo.title, seo.description, seo.ogImage);
```

## Configuration

### Custom Headers

```javascript
const parser = new HtmlFetchParser({
  headers: {
    'User-Agent': 'My Bot 1.0',
    'Accept-Language': 'en-US'
  },
  timeout: 5000
});

const html = await parser.fetch('https://example.com');
```

### Modify Headers After Creation

```javascript
const parser = new HtmlFetchParser();
parser.fetcher.setHeaders({ 'Authorization': 'Bearer token' });
parser.fetcher.setTimeout(15000);
```

## Error Handling

```javascript
try {
  const parser = await HtmlFetchParser.fetch('https://example.com');
} catch (error) {
  if (error.message.includes('timeout')) {
    console.log('Request timed out');
  } else if (error.message.includes('HTTP Error')) {
    console.log('Server error:', error.message);
  }
}
```

## Performance Tips

1. **Use specific selectors** - More specific CSS selectors are faster
2. **Parse once** - Load HTML once and reuse the parser
3. **Stream large files** - For very large files, process in chunks
4. **Cache results** - Store parsed data if fetching multiple times

## Security Considerations

- Always validate user input before using as selectors
- Use `Validator.hasMaliciousContent()` when parsing untrusted HTML
- Never execute extracted scripts or styles
- Sanitize data before rendering or storing

## Browser vs Node.js

This library works in both Node.js and modern browsers. In browsers, it uses the native `fetch` API and DOM parsing.

```javascript
// Browser
<script src="https://cdn.example.com/html-fetch-parser.js"></script>
<script>
  HtmlFetchParser.fetch('/api/data').then(parser => {
    console.log(parser.getTitle());
  });
</script>
```

## Contributing

Contributions are welcome! Please submit pull requests or issues on GitHub.

## License

MIT - See LICENSE file for details

## Changelog

### v1.0.1 (Latest)
- ✨ Added **Validator** class for HTML/URL/email validation
- ✨ Added **TableParser** for parsing HTML tables with search, sort, filter
- ✨ Added **FormParser** for extracting and validating form data
- 🎨 Enhanced Manipulator with minify, prettify, SEO extraction
- 📚 Improved documentation and examples
- 🔒 Added security checks and content validation

### v1.0.0
- Initial release with Fetcher, Parser, and Manipulator
