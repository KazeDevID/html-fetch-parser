const HtmlFetchParser = require('../index');
const { FormParser } = require('../index');

// Example HTML with forms
const html = `
  <html>
    <body>
      <form id="contact-form" action="/submit" method="POST">
        <input type="text" name="fullname" placeholder="Full Name" required />
        <input type="email" name="email" placeholder="Email" required />
        <input type="tel" name="phone" placeholder="Phone" pattern="[0-9]{10}" />
        <textarea name="message" placeholder="Your message" minlength="10" maxlength="500"></textarea>
        <select name="country" required>
          <option value="">Select Country</option>
          <option value="us">United States</option>
          <option value="uk">United Kingdom</option>
          <option value="ca">Canada</option>
        </select>
        <input type="checkbox" name="subscribe" value="1" />
        <button type="submit">Submit</button>
      </form>
    </body>
  </html>
`;

// Initialize parser
const parser = new HtmlFetchParser();
parser.load(html);

// Parse forms
const forms = FormParser.parseForms(parser.getRawHtml());
console.log('Parsed Forms:', forms);

if (forms.length > 0) {
  const form = forms[0];

  // Get required fields
  const requiredFields = FormParser.getRequiredFields(form);
  console.log('\nRequired Fields:', requiredFields.map(f => f.name));

  // Generate form template
  const template = FormParser.generateTemplate(form);
  console.log('\nForm Template:', template);

  // Validate form data
  const testData = {
    fullname: 'John Doe',
    email: 'john@example.com',
    phone: '1234567890',
    message: 'This is a test message',
    country: 'us'
  };

  const validation = FormParser.validate(form, testData);
  console.log('\nValidation Result:', validation);

  // Convert to JSON Schema
  const jsonSchema = FormParser.toJsonSchema(form);
  console.log('\nForm JSON Schema:', JSON.stringify(jsonSchema, null, 2));
}
