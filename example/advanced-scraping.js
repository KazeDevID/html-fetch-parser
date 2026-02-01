const HtmlFetchParser = require('../index');
const { Manipulator } = require('../index');

async function advancedScrapingExample() {
  console.log('=== Advanced Web Scraping Example ===\n');

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title>E-Commerce Store</title>
        <meta name="description" content="Best products online">
        <script type="application/ld+json">
          {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "Example Product"
          }
        </script>
      </head>
      <body>
        <header>
          <nav>
            <a href="/home">Home</a>
            <a href="/products">Products</a>
            <a href="/about">About</a>
          </nav>
        </header>

        <main>
          <h1>Featured Products</h1>

          <article class="product" data-id="1">
            <h2 class="product-name">Laptop Pro</h2>
            <p class="description">High-performance laptop for professionals</p>
            <span class="price" data-currency="USD">$1,299.99</span>
            <span class="stock">In Stock</span>
            <a href="/products/laptop-pro" class="btn">View Details</a>
          </article>

          <article class="product" data-id="2">
            <h2 class="product-name">Wireless Mouse</h2>
            <p class="description">Ergonomic wireless mouse with long battery life</p>
            <span class="price" data-currency="USD">$49.99</span>
            <span class="stock">Low Stock</span>
            <a href="/products/wireless-mouse" class="btn">View Details</a>
          </article>

          <article class="product" data-id="3">
            <h2 class="product-name">USB-C Cable</h2>
            <p class="description">Fast charging USB-C cable, 6ft length</p>
            <span class="price" data-currency="USD">$12.99</span>
            <span class="stock">In Stock</span>
            <a href="/products/usb-c-cable" class="btn">View Details</a>
          </article>
        </main>

        <footer>
          <p>Contact: sales@example.com | support@example.com</p>
          <p>Visit our blog: https://blog.example.com</p>
        </footer>
      </body>
    </html>
  `;

  const parser = new HtmlFetchParser();
  parser.load(html);

  console.log('=== Page Metadata ===');
  console.log('Title:', parser.getTitle());
  console.log('Description:', parser.getMeta('description'));
  console.log();

  console.log('=== Navigation Links ===');
  const navLinks = parser.extract({
    links: {
      selector: 'nav a',
      attr: 'href',
      multiple: true
    }
  });
  console.log(navLinks);
  console.log();

  console.log('=== Extract All Products ===');
  const products = [];
  const productElements = parser.$$('.product');

  productElements.forEach(productEl => {
    const tempParser = new HtmlFetchParser();
    tempParser.load(productEl.outerHTML);

    products.push({
      id: productEl.getAttribute('data-id'),
      name: tempParser.text('.product-name'),
      description: tempParser.text('.description'),
      price: tempParser.text('.price'),
      priceNumeric: parseFloat(tempParser.text('.price').replace(/[^0-9.]/g, '')),
      stock: tempParser.text('.stock'),
      url: tempParser.attr('.btn', 'href')
    });
  });

  console.log(JSON.stringify(products, null, 2));
  console.log();

  console.log('=== Statistics ===');
  const totalProducts = products.length;
  const inStockProducts = products.filter(p => p.stock === 'In Stock').length;
  const avgPrice = products.reduce((sum, p) => sum + p.priceNumeric, 0) / totalProducts;

  console.log(`Total Products: ${totalProducts}`);
  console.log(`In Stock: ${inStockProducts}`);
  console.log(`Average Price: $${avgPrice.toFixed(2)}`);
  console.log();

  console.log('=== Extract Contact Information ===');
  const footerText = parser.text('footer');
  const emails = Manipulator.extractEmails(footerText);
  const urls = Manipulator.extractUrls(footerText);

  console.log('Email addresses:', emails);
  console.log('URLs:', urls);
  console.log();

  console.log('=== Structured Data ===');
  const structuredData = Manipulator.extractStructuredData(parser.getRawHtml());
  console.log(JSON.stringify(structuredData, null, 2));
  console.log();

  console.log('=== Text Analysis ===');
  const mainContent = parser.text('main');
  const cleanText = Manipulator.cleanWhitespace(mainContent);
  const wordCount = Manipulator.wordCount(cleanText);
  const preview = Manipulator.truncate(cleanText, 100);

  console.log(`Word Count: ${wordCount}`);
  console.log(`Preview: ${preview}`);
  console.log();

  console.log('=== Convert URLs to Absolute ===');
  const baseUrl = 'https://example.com';
  const absoluteUrls = products.map(p => ({
    name: p.name,
    url: Manipulator.toAbsoluteUrl(p.url, baseUrl)
  }));
  console.log(absoluteUrls);
}

advancedScrapingExample().catch(console.error);
