/**
 * Exports data to a CSV file
 * @param data Array of objects to export
 * @param filename Name of the file to download
 */
export const exportToCsv = (data: any[], filename: string): void => {
  // If there's no data, return
  if (!data || !data.length) {
    console.error('No data to export');
    return;
  }

  // Get the headers from the first object
  const headers = Object.keys(data[0]);

  // Create CSV content
  const csvContent = [
    // Add headers row
    headers.join(','),
    // Add data rows
    ...data.map(row => {
      return headers.map(header => {
        // Handle special cases like objects, arrays, null, undefined
        const cell = row[header];
        
        if (cell === null || cell === undefined) {
          return '';
        }
        
        if (typeof cell === 'object') {
          // Convert objects to JSON strings
          const cellStr = JSON.stringify(cell).replace(/"/g, '""');
          return `"${cellStr}"`;
        }
        
        // Handle strings with commas by wrapping in quotes
        if (typeof cell === 'string' && (cell.includes(',') || cell.includes('"') || cell.includes('\n'))) {
          return `"${cell.replace(/"/g, '""')}"`;
        }
        
        return cell;
      }).join(',');
    })
  ].join('\n');

  // Create a blob with the CSV content
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create a download link
  const link = document.createElement('a');
  
  // Create a URL for the blob
  const url = URL.createObjectURL(blob);
  
  // Set link properties
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  // Add link to document
  document.body.appendChild(link);
  
  // Click the link to download the file
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}; 