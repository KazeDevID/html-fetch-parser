/**
 * Advanced Features Example
 * Showcases advanced features like data transformation, validation, and complex extraction
 */

const HtmlFetchParser = require('../index');
const { Validator, Manipulator, FormParser, TableParser } = require('../index');

// Example 1: Custom Data Extraction with Transforms
console.log('=== EXAMPLE 1: Custom Data Extraction ===\n');

const productHtml = `
  <html>
    <head><title>Product Catalog</title></head>
    <body>
      <h1>Featured Products</h1>
      <div class="products">
        <div class="product">
          <h2 class="title">Laptop Pro</h2>
          <span class="price">$1,299.99</span>
          <p class="description">High-performance laptop</p>
          <a href="/product/1" class="url">View Details</a>
        </div>
        <div class="product">
          <h2 class="title">Mouse Wireless</h2>
          <span class="price">$29.99</span>
          <p class="description">Ergonomic wireless mouse</p>
          <a href="/product/2" class="url">View Details</a>
        </div>
      </div>
    </body>
  </html>
`;

const parser = new HtmlFetchParser();
parser.load(productHtml);

// Extract with transformation functions
const products = parser.extract({
  title: 'h1',
  products: {
    selector: '.product',
    multiple: true,
    transform: (data) => {
      // This would need custom implementation in real scenario
      return 'Products extracted';
    }
  }
});

console.log('Extracted data:', products);

// Example 2: Security and Validation
console.log('\n=== EXAMPLE 2: Security & Validation ===\n');

const maliciousHtml = `
  <div>
    <img src="image.jpg" onerror="alert('XSS')">
    <a href="javascript:void(0)">Click me</a>
  </div>
`;

const safeHtml = `
  <div>
    <img src="image.jpg" alt="Safe image">
    <a href="https://example.com">Link</a>
  </div>
`;

console.log('Malicious HTML:', Validator.hasMaliciousContent(maliciousHtml) ? '⚠️ Unsafe' : '✓ Safe');
console.log('Safe HTML:', Validator.hasMaliciousContent(safeHtml) ? '⚠️ Unsafe' : '✓ Safe');

// Validate multiple URLs
const urlsToValidate = [
  'https://example.com',
  'not-a-url',
  'https://github.com/user/repo',
  'ftp://example.com'
];

console.log('\nURL Validation:');
urlsToValidate.forEach(url => {
  const isValid = Validator.isValidUrl(url);
  console.log(`  ${url.padEnd(30)} -> ${isValid ? '✓ Valid' : '✗ Invalid'}`);
});

// Example 3: Table Analysis and Filtering
console.log('\n=== EXAMPLE 3: Table Analysis ===\n');

const analysisHtml = `
  <table>
    <thead>
      <tr>
        <th>Product</th>
        <th>Q1</th>
        <th>Q2</th>
        <th>Q3</th>
        <th>Q4</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Widget A</td>
        <td>1000</td>
        <td>1500</td>
        <td>1800</td>
        <td>2100</td>
      </tr>
      <tr>
        <td>Widget B</td>
        <td>500</td>
        <td>600</td>
        <td>700</td>
        <td>800</td>
      </tr>
      <tr>
        <td>Gadget X</td>
        <td>2000</td>
        <td>1800</td>
        <td>1600</td>
        <td>1400</td>
      </tr>
    </tbody>
  </table>
`;

const tableParser = new HtmlFetchParser();
tableParser.load(analysisHtml);
const tables = TableParser.parseTables(analysisHtml);

if (tables.length > 0) {
  const table = tables[0];
  
  // Search for products
  const widgetResults = TableParser.search(table, 'Widget');
  console.log(`Found ${widgetResults.length} Widget products:`);
  widgetResults.forEach(row => {
    console.log(`  - ${row.Product}: Q1=${row.Q1}, Q4=${row.Q4}`);
  });

  // Sort by Q4 sales
  const sortedByQ4 = TableParser.sort(table, 'Q4', 'desc');
  console.log('\nTop performers (by Q4):');
  sortedByQ4.rows.slice(0, 2).forEach((row, idx) => {
    console.log(`  ${idx + 1}. ${row.Product} ($${row.Q4})`);
  });

  // Export to different formats
  console.log('\nExport formats:');
  console.log('CSV:', TableParser.tableToCSV(table).split('\n')[0]);
}

// Example 4: Form Validation with Custom Rules
console.log('\n=== EXAMPLE 4: Advanced Form Validation ===\n');

const complexFormHtml = `
  <form id="registration">
    <input type="text" name="username" minlength="3" maxlength="20" required />
    <input type="email" name="email" required />
    <input type="password" name="password" minlength="8" required />
    <input type="tel" name="phone" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" />
    <select name="country" required>
      <option value="">Select Country</option>
      <option value="US">United States</option>
      <option value="CA">Canada</option>
    </select>
    <textarea name="bio" maxlength="500"></textarea>
  </form>
`;

const formParser = new HtmlFetchParser();
formParser.load(complexFormHtml);
const forms = FormParser.parseForms(complexFormHtml);

if (forms.length > 0) {
  const form = forms[0];
  
  console.log('Form fields:');
  form.fields.forEach(field => {
    const constraints = [];
    if (field.required) constraints.push('required');
    if (field.minLength) constraints.push(`min:${field.minLength}`);
    if (field.maxLength) constraints.push(`max:${field.maxLength}`);
    if (field.pattern) constraints.push(`pattern:${field.pattern}`);
    
    console.log(`  - ${field.name} (${field.type}) ${constraints.join(', ')}`);
  });

  // Test various invalid inputs
  console.log('\nValidation examples:');
  
  const testCases = [
    { username: 'ab', email: 'test@example.com', password: 'pass', country: 'US' },
    { username: 'john', email: 'invalid-email', password: 'password123', country: 'US' },
    { username: 'john', email: 'john@example.com', password: 'pass', country: 'US' },
    { username: 'john', email: 'john@example.com', password: 'password123', phone: '555-555-5555', country: 'US' }
  ];

  testCases.forEach((testData, idx) => {
    const result = FormParser.validate(form, testData);
    console.log(`\n  Case ${idx + 1}: ${result.isValid ? '✓ Valid' : '✗ Invalid'}`);
    if (!result.isValid) {
      result.errors.slice(0, 2).forEach(err => console.log(`    - ${err}`));
    }
  });
}

// Example 5: HTML Analysis and Metrics
console.log('\n=== EXAMPLE 5: HTML Analysis ===\n');

const richHtml = `
  <html>
    <head>
      <title>Complete Web Page</title>
      <meta name="description" content="A comprehensive web page" />
      <meta property="og:title" content="Open Graph Title" />
      <script>console.log('test');</script>
      <style>body { color: black; }</style>
    </head>
    <body>
      <h1>Main Title</h1>
      <h2>Subtitle</h2>
      <p>This is a paragraph with some <strong>important</strong> content.</p>
      <p>Another paragraph with more information.</p>
      <a href="https://example.com">Link 1</a>
      <a href="/page">Link 2</a>
      <img src="image.jpg" alt="Image" />
      <form><input type="text" name="test" /></form>
    </body>
  </html>
`;

// Analyze HTML structure
const htmlMetadata = Validator.getMetadata(richHtml);
console.log('HTML Metrics:');
console.log(`  File size: ${htmlMetadata.size} bytes`);
console.log(`  Total tags: ${htmlMetadata.tags}`);
console.log(`  Links: ${htmlMetadata.links}`);
console.log(`  Images: ${htmlMetadata.images}`);
console.log(`  Forms: ${htmlMetadata.forms}`);
console.log(`  Scripts: ${htmlMetadata.scripts}`);
console.log(`  Styles: ${htmlMetadata.styles}`);

// Get document structure
const hierarchy = Manipulator.getHeadingHierarchy(richHtml);
console.log('\nDocument Hierarchy:');
hierarchy.forEach(h => {
  console.log(`  ${'  '.repeat(h.level - 1)}${h.tag}: ${h.text}`);
});

// Extract SEO data
const seo = Manipulator.extractSeoMeta(richHtml);
console.log('\nSEO Metadata:');
console.log(`  Title: ${seo.title}`);
console.log(`  Description: ${seo.description}`);
console.log(`  OG Title: ${seo.ogTitle}`);

// Count specific elements
const elementCounts = Manipulator.countElements(richHtml, ['h1', 'h2', 'p', 'a', 'img', 'script']);
console.log('\nElement Counts:', elementCounts);

// Example 6: HTML Cleaning
console.log('\n=== EXAMPLE 6: HTML Cleaning ===\n');

const messyHtml = `
  <div>
    <p>Paragraph 1</p>
    <!-- This is a comment -->
    <p>Paragraph 2</p>
    <script>alert('xss')</script>
    <p>Paragraph 3</p>
  </div>
`;

console.log('Original size:', messyHtml.length, 'bytes');
const cleaned = Manipulator.removeScriptsAndStyles(messyHtml);
console.log('After cleaning:', cleaned.length, 'bytes');
const minified = Manipulator.minifyHtml(cleaned);
console.log('After minifying:', minified.length, 'bytes');

console.log('\n✓ All advanced examples completed!');
