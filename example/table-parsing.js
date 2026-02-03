const HtmlFetchParser = require('../index');
const { TableParser } = require('../index');

// Example HTML with tables
const html = `
  <html>
    <body>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>City</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>John</td>
            <td>28</td>
            <td>New York</td>
          </tr>
          <tr>
            <td>Jane</td>
            <td>32</td>
            <td>Los Angeles</td>
          </tr>
          <tr>
            <td>Bob</td>
            <td>25</td>
            <td>Chicago</td>
          </tr>
        </tbody>
      </table>
    </body>
  </html>
`;

// Initialize parser
const parser = new HtmlFetchParser();
parser.load(html);

// Parse tables
const tables = TableParser.parseTables(parser.getRawHtml());
console.log('Parsed Tables:', tables);

// Convert to CSV
if (tables.length > 0) {
  const csv = TableParser.tableToCSV(tables[0]);
  console.log('\nTable as CSV:\n', csv);

  const json = TableParser.tableToJSON(tables[0]);
  console.log('\nTable as JSON:\n', json);

  // Search in table
  const results = TableParser.search(tables[0], 'New York');
  console.log('\nSearch results for "New York":', results);

  // Sort table
  const sorted = TableParser.sort(tables[0], 'Age', 'asc');
  console.log('\nSorted by Age (ascending):', sorted.rows);
}
