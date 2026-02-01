const { Manipulator } = require('../index');

console.log('=== Manipulator Example ===\n');

const html = `
  <div>
    <h1>Hello &amp; Welcome!</h1>
    <p>Contact us at: info@example.com or support@test.com</p>
    <script>alert('test');</script>
    <p>Visit https://example.com for more info</p>
  </div>
`;

console.log('Original HTML:');
console.log(html);

console.log('\nStrip tags:');
console.log(Manipulator.stripTags(html));

console.log('\nDecode entities:');
console.log(Manipulator.decodeEntities('Hello &amp; Welcome!'));

console.log('\nExtract emails:');
console.log(Manipulator.extractEmails(html));

console.log('\nExtract URLs:');
console.log(Manipulator.extractUrls(html));

console.log('\nRemove scripts:');
console.log(Manipulator.removeScriptsAndStyles(html));

console.log('\nTruncate text:');
console.log(Manipulator.truncate('This is a very long text that needs truncating', 20));

console.log('\nWord count:');
console.log(Manipulator.wordCount('Hello world this is a test'));

console.log('\nConvert to absolute URL:');
console.log(Manipulator.toAbsoluteUrl('/path/to/page', 'https://example.com'));
