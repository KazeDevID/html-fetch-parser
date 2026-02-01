const { fetch } = require('../index');

async function fetchExample() {
  console.log('=== Fetch Remote HTML Example ===\n');

  try {
    const parser = await fetch('https://freepublicapisss.vercel.app/');

    console.log('Title:', parser.getTitle());
    console.log('First paragraph:', parser.text('p'));
    console.log('All links:', parser.getLinks());

    const data = parser.extract({
      title: 'h1',
      paragraphs: {
        selector: 'p',
        multiple: true
      }
    });

    console.log('\nExtracted data:', data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

fetchExample();
