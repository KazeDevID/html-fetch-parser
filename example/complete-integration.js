/**
 * Complete Integration Example
 * Demonstrates all features of html-fetch-parser working together
 */

const HtmlFetchParser = require('../index');
const { Validator, TableParser, FormParser, Manipulator } = require('../index');

// Sample HTML with all features
const sampleHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Complete Integration Example</title>
  <meta name="description" content="This is a sample page for testing all features" />
  <meta property="og:image" content="https://example.com/image.jpg" />
</head>
<body>
  <h1>Data Processing Dashboard</h1>
  <h2>User Information</h2>
  
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Email</th>
        <th>Department</th>
        <th>Salary</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>John Smith</td>
        <td>john@example.com</td>
        <td>Engineering</td>
        <td>85000</td>
      </tr>
      <tr>
        <td>2</td>
        <td>Jane Doe</td>
        <td>jane@example.com</td>
        <td>Marketing</td>
        <td>75000</td>
      </tr>
      <tr>
        <td>3</td>
        <td>Bob Johnson</td>
        <td>bob@example.com</td>
        <td>Engineering</td>
        <td>90000</td>
      </tr>
    </tbody>
  </table>

  <h2>Contact Form</h2>
  <form id="contact-form" action="/submit" method="POST">
    <input type="text" name="fullname" placeholder="Full Name" required />
    <input type="email" name="email" placeholder="Email" required />
    <input type="tel" name="phone" placeholder="Phone" />
    <textarea name="message" placeholder="Your message" minlength="10" required></textarea>
    <select name="subject" required>
      <option value="">Select Subject</option>
      <option value="support">Support</option>
      <option value="sales">Sales</option>
      <option value="feedback">Feedback</option>
    </select>
    <input type="checkbox" name="subscribe" value="1" />
    <button type="submit">Send Message</button>
  </form>

  <h2>Related Links</h2>
  <ul>
    <li><a href="https://example.com/home">Home</a></li>
    <li><a href="https://example.com/about">About</a></li>
    <li><a href="/contact">Contact</a></li>
  </ul>

  <h2>Featured Images</h2>
  <img src="https://example.com/image1.jpg" alt="Featured image 1" />
  <img src="https://example.com/image2.jpg" alt="Featured image 2" />
</body>
</html>
`;

async function runIntegrationExample() {
  console.log('='.repeat(60));
  console.log('HTML Fetch Parser - Complete Integration Example');
  console.log('='.repeat(60));

  // Step 1: Validate HTML
  console.log('\n1. HTML VALIDATION');
  console.log('-'.repeat(40));
  if (!Validator.isValidHtml(sampleHtml)) {
    console.log('❌ Invalid HTML');
    return;
  }
  console.log('✓ HTML is valid');

  const metadata = Validator.getMetadata(sampleHtml);
  console.log(`✓ Page contains: ${metadata.tags} tags, ${metadata.links} links, ${metadata.images} images, ${metadata.forms} form(s), 1 table`);

  // Step 2: Extract SEO Metadata
  console.log('\n2. SEO METADATA EXTRACTION');
  console.log('-'.repeat(40));
  const seoMeta = Manipulator.extractSeoMeta(sampleHtml);
  console.log(`✓ Title: ${seoMeta.title}`);
  console.log(`✓ Description: ${seoMeta.description}`);
  console.log(`✓ OG Image: ${seoMeta.ogImage}`);

  // Step 3: Parse HTML with main parser
  console.log('\n3. PARSING HTML DOCUMENT');
  console.log('-'.repeat(40));
  const parser = new HtmlFetchParser();
  parser.load(sampleHtml);
  
  const pageTitle = parser.getTitle();
  const heading = parser.text('h1');
  const allLinks = parser.$$('a');
  
  console.log(`✓ Page Title: ${pageTitle}`);
  console.log(`✓ Main Heading: ${heading}`);
  console.log(`✓ Found ${allLinks.length} links`);

  // Step 4: Extract Links
  console.log('\n4. LINK EXTRACTION');
  console.log('-'.repeat(40));
  const links = parser.getLinks();
  links.forEach((link, index) => {
    console.log(`  ${index + 1}. ${link.text || '(no text)'} -> ${link.href}`);
  });

  // Step 5: Extract Images
  console.log('\n5. IMAGE EXTRACTION');
  console.log('-'.repeat(40));
  const images = parser.getImages();
  images.forEach((img, index) => {
    console.log(`  ${index + 1}. ${img.alt || '(no alt)'}  -> ${img.src}`);
  });

  // Step 6: Parse Table
  console.log('\n6. TABLE PARSING & PROCESSING');
  console.log('-'.repeat(40));
  const tables = TableParser.parseTables(parser.getRawHtml());
  
  if (tables.length > 0) {
    const table = tables[0];
    console.log(`✓ Table found with ${table.rowCount} rows and ${table.columnCount} columns`);
    console.log(`\n  Headers: ${table.headers.join(' | ')}`);

    // Search for Engineering department
    const engineeringEmployees = TableParser.search(table, 'Engineering', ['Department']);
    console.log(`\n✓ Found ${engineeringEmployees.length} Engineering employees:`);
    engineeringEmployees.forEach(emp => {
      console.log(`    - ${emp.Name} (${emp.Department}) - $${emp.Salary}`);
    });

    // Sort by salary
    const sortedBySalary = TableParser.sort(table, 'Salary', 'desc');
    console.log(`\n✓ Top earner: ${sortedBySalary.rows[0].Name} ($${sortedBySalary.rows[0].Salary})`);

    // Export to CSV
    const csv = TableParser.tableToCSV(table);
    console.log(`\n✓ CSV Export (first 100 chars):\n${csv.substring(0, 100)}...`);
  }

  // Step 7: Parse Form
  console.log('\n7. FORM PARSING & VALIDATION');
  console.log('-'.repeat(40));
  const forms = FormParser.parseForms(parser.getRawHtml());
  
  if (forms.length > 0) {
    const form = forms[0];
    console.log(`✓ Form found: ${form.id || 'unnamed'}`);
    console.log(`✓ Method: ${form.method}, Action: ${form.action}`);
    
    const requiredFields = FormParser.getRequiredFields(form);
    console.log(`✓ Required fields (${requiredFields.length}):`);
    requiredFields.forEach(field => {
      console.log(`    - ${field.name} (${field.type})`);
    });

    // Test form validation
    console.log('\n✓ Form validation test:');
    const testData = {
      fullname: 'John Doe',
      email: 'john@example.com',
      phone: '555-1234',
      message: 'This is a short message', // Too short
      subject: 'support'
    };

    const validation = FormParser.validate(form, testData);
    if (validation.isValid) {
      console.log('    ✓ Form is valid!');
    } else {
      console.log('    ✗ Validation errors:');
      validation.errors.forEach(error => console.log(`      - ${error}`));
    }

    // Generate form template
    const template = FormParser.generateTemplate(form);
    console.log(`\n✓ Form template keys: ${Object.keys(template).join(', ')}`);
  }

  // Step 8: HTML Manipulation
  console.log('\n8. HTML MANIPULATION');
  console.log('-'.repeat(40));
  
  const headingHierarchy = Manipulator.getHeadingHierarchy(sampleHtml);
  console.log(`✓ Document structure (${headingHierarchy.length} headings):`);
  headingHierarchy.forEach(h => {
    const indent = '  '.repeat(h.level - 1);
    console.log(`  ${indent}${h.tag}: ${h.text}`);
  });

  // Count elements
  const counts = Manipulator.countElements(sampleHtml, ['h1', 'h2', 'table', 'form', 'a', 'img']);
  console.log(`\n✓ Element counts:`, counts);

  // Step 9: Data Export
  console.log('\n9. DATA EXPORT');
  console.log('-'.repeat(40));
  if (tables.length > 0) {
    const jsonData = TableParser.tableToJSON(tables[0]);
    console.log('✓ JSON export available');
    console.log(`  ${jsonData.split('\n')[0]}...`);
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('✓ Integration test completed successfully!');
  console.log('='.repeat(60));
}

// Run the example
runIntegrationExample().catch(error => {
  console.error('Error:', error.message);
});
