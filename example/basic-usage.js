const HtmlFetchParser = require('../index');

async function basicExample() {
  console.log('=== HTML Fetch Parser - Basic Usage ===\n');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Sample Page</title>
        <meta name="description" content="This is a sample page">
      </head>
      <body>
        <h1>Welcome to HTML Fetch Parser</h1>
        <p class="intro">A lightweight library for HTML manipulation</p>
        <div class="content">
          <h2>Features</h2>
          <ul>
            <li>Easy HTML fetching</li>
            <li>Powerful parsing</li>
            <li>Simple manipulation</li>
          </ul>
        </div>
        <a href="/docs" title="Documentation">Read Docs</a>
        <img src="/logo.png" alt="Logo">
      </body>
    </html>
  `;

  const parser = new HtmlFetchParser();
  parser.load(html);

  console.log('Title:', parser.getTitle());
  console.log('Meta description:', parser.getMeta('description'));
  console.log('H1 text:', parser.text('h1'));
  console.log('Intro text:', parser.text('.intro'));
  console.log('All list items:', parser.textAll('li'));
  console.log('Links:', parser.getLinks());
  console.log('Images:', parser.getImages());

  console.log('\n=== Extract with Schema ===');
  const data = parser.extract({
    title: 'h1',
    intro: '.intro',
    features: {
      selector: 'li',
      multiple: true
    },
    linkHref: {
      selector: 'a',
      attr: 'href'
    }
  });
  console.log(data);
}

basicExample().catch(console.error);
