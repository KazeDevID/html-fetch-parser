/**
 * Table Parser Module
 * Parse HTML tables into structured data
 */

class TableParser {
  /**
   * Parse a single table
   * @param {object} tableElement - Table DOM element
   * @returns {object} Parsed table data
   */
  static parseTable(tableElement) {
    if (!tableElement) return null;

    const headers = [];
    const rows = [];

    // Extract headers
    const headerCells = tableElement.querySelectorAll('thead th, thead td');
    headerCells.forEach(cell => {
      headers.push(cell.text.trim());
    });

    // If no thead, try to get first row as headers
    if (headers.length === 0) {
      const firstRow = tableElement.querySelector('tbody tr');
      if (firstRow) {
        const firstRowCells = firstRow.querySelectorAll('td, th');
        firstRowCells.forEach(cell => {
          headers.push(cell.text.trim());
        });
      }
    }

    // Extract rows
    const bodyRows = tableElement.querySelectorAll('tbody tr, tr:not(:has(th))');
    bodyRows.forEach(row => {
      const cells = row.querySelectorAll('td, th');
      const rowData = {};

      cells.forEach((cell, index) => {
        const header = headers[index] || `Column ${index + 1}`;
        rowData[header] = cell.text.trim();
      });

      if (Object.keys(rowData).length > 0) {
        rows.push(rowData);
      }
    });

    return {
      headers,
      rows,
      rowCount: rows.length,
      columnCount: headers.length
    };
  }

  /**
   * Parse all tables in HTML
   * @param {object} root - Root DOM element or parser root
   * @returns {Array<object>} Array of parsed tables
   */
  static parseTables(root) {
    if (!root) return [];

    const tables = root.querySelectorAll ? root.querySelectorAll('table') : [];
    const parsedTables = [];

    tables.forEach((table, index) => {
      const parsed = this.parseTable(table);
      if (parsed && parsed.rows.length > 0) {
        parsedTables.push({
          index,
          ...parsed
        });
      }
    });

    return parsedTables;
  }

  /**
   * Convert table to CSV format
   * @param {object} tableData - Parsed table data
   * @param {string} delimiter - Delimiter (default: ',')
   * @returns {string} CSV string
   */
  static tableToCSV(tableData, delimiter = ',') {
    if (!tableData || !tableData.headers) return '';

    const { headers, rows } = tableData;

    // Create header row
    const csvHeaders = headers
      .map(h => `"${h.replace(/"/g, '""')}"`)
      .join(delimiter);

    // Create data rows
    const csvRows = rows.map(row => {
      return headers
        .map(header => {
          const value = row[header] || '';
          return `"${value.replace(/"/g, '""')}"`;
        })
        .join(delimiter);
    });

    return [csvHeaders, ...csvRows].join('\n');
  }

  /**
   * Convert table to JSON format
   * @param {object} tableData - Parsed table data
   * @returns {string} JSON string
   */
  static tableToJSON(tableData) {
    if (!tableData) return '[]';
    return JSON.stringify(tableData.rows, null, 2);
  }

  /**
   * Filter table rows
   * @param {object} tableData - Parsed table data
   * @param {Function} predicate - Filter function
   * @returns {object} Filtered table data
   */
  static filterRows(tableData, predicate) {
    if (!tableData) return null;

    return {
      ...tableData,
      rows: tableData.rows.filter(predicate),
      rowCount: tableData.rows.filter(predicate).length
    };
  }

  /**
   * Search in table
   * @param {object} tableData - Parsed table data
   * @param {string} searchTerm - Search term
   * @param {Array<string>} columns - Columns to search (default: all)
   * @returns {Array<object>} Matching rows
   */
  static search(tableData, searchTerm, columns = null) {
    if (!tableData) return [];

    const term = searchTerm.toLowerCase();
    const columnsToSearch = columns || tableData.headers;

    return tableData.rows.filter(row => {
      return columnsToSearch.some(column => {
        const value = (row[column] || '').toString().toLowerCase();
        return value.includes(term);
      });
    });
  }

  /**
   * Sort table rows
   * @param {object} tableData - Parsed table data
   * @param {string} column - Column to sort by
   * @param {string} order - 'asc' or 'desc'
   * @returns {object} Sorted table data
   */
  static sort(tableData, column, order = 'asc') {
    if (!tableData) return null;

    const sorted = [...tableData.rows].sort((a, b) => {
      const valA = a[column] || '';
      const valB = b[column] || '';

      // Try numeric comparison
      const numA = parseFloat(valA);
      const numB = parseFloat(valB);

      if (!isNaN(numA) && !isNaN(numB)) {
        return order === 'asc' ? numA - numB : numB - numA;
      }

      // String comparison
      const comparison = valA.toString().localeCompare(valB.toString());
      return order === 'asc' ? comparison : -comparison;
    });

    return {
      ...tableData,
      rows: sorted
    };
  }
}

module.exports = TableParser;
