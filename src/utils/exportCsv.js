export function exportToCSV(data, filename = 'export.csv') {
  if (!data || !data.length) {
    alert('No data available to export');
    return;
  }

  // Extract keys
  const headers = Object.keys(data[0]);

  const csvRows = [];
  // Add header row
  csvRows.push(headers.join(','));

  // Add row data
  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header];
      if (val === null || val === undefined) return '""';
      const escaped = String(val).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvRows.join('\n'));
  const link = document.createElement('a');
  link.setAttribute('href', csvContent);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
