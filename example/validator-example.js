const { Validator, Manipulator } = require('../index');

// Example 1: HTML Validation
console.log('=== HTML Validation ===');
const validHtml = '<html><head><title>Test</title></head><body></body></html>';
const invalidHtml = 'Not HTML';

console.log('Valid HTML:', Validator.isValidHtml(validHtml));
console.log('Invalid HTML:', Validator.isValidHtml(invalidHtml));

// Validate HTML structure
const structureValidation = Validator.validateStructure(validHtml);
console.log('\nStructure Validation:', structureValidation);

// Get HTML metadata
const metadata = Validator.getMetadata(validHtml);
console.log('\nHTML Metadata:', metadata);

// Example 2: URL Validation
console.log('\n=== URL Validation ===');
console.log('Valid URL:', Validator.isValidUrl('https://example.com'));
console.log('Invalid URL:', Validator.isValidUrl('not a url'));

// Example 3: Email Validation
console.log('\n=== Email Validation ===');
console.log('Valid Email:', Validator.isValidEmail('john@example.com'));
console.log('Invalid Email:', Validator.isValidEmail('not-an-email'));

// Example 4: Check malicious content
console.log('\n=== Security Check ===');
const safeHtml = '<div>Hello World</div>';
const maliciousHtml = '<div onclick="alert(\'xss\')">Click me</div>';

console.log('Safe HTML:', !Validator.hasMaliciousContent(safeHtml));
console.log('Malicious HTML:', Validator.hasMaliciousContent(maliciousHtml));

// Example 5: HTML Manipulation Examples
console.log('\n=== HTML Manipulation ===');

// Minify HTML
const prettyHtml = `
  <div>
    <h1>Title</h1>
    <p>Content</p>
  </div>
`;

const minified = Manipulator.minifyHtml(prettyHtml);
console.log('Minified HTML:', minified);

// Get heading hierarchy
const htmlWithHeadings = `
  <h1>Main Title</h1>
  <h2>Subtitle</h2>
  <h2>Another Subtitle</h2>
  <h3>Sub-subtitle</h3>
`;

const headings = Manipulator.getHeadingHierarchy(htmlWithHeadings);
console.log('\nHeading Hierarchy:', headings);

// Extract SEO meta
const seoHtml = `
  <html>
    <head>
      <title>My Page</title>
      <meta name="description" content="This is my page description" />
      <meta property="og:title" content="My Page OG Title" />
      <meta property="og:image" content="https://example.com/image.jpg" />
    </head>
  </html>
`;

const seoMeta = Manipulator.extractSeoMeta(seoHtml);
console.log('\nSEO Meta:', seoMeta);

// Count elements
const countHtml = `
  <div>
    <p>Paragraph 1</p>
    <p>Paragraph 2</p>
    <a href="#">Link 1</a>
    <a href="#">Link 2</a>
    <a href="#">Link 3</a>
  </div>
`;

const counts = Manipulator.countElements(countHtml, ['p', 'a', 'div']);
console.log('\nElement Counts:', counts);
