//Functions to download table data in JSON, PDF, Excel and CSV format
const table_rows = document.querySelectorAll('tbody tr');
const table_headings = document.querySelectorAll('thead th');

const SEOTable = document.querySelector('.table__body');
const tabletoExport = document.querySelector('#main');

// Converting HTML table to JSON, CSV, Excel, and PDF files

// Function to convert HTML table to JSON
const toJSON = function(table) {
  const table_data = [];
  const t_headings = table.querySelectorAll('th');
  const t_rows = table.querySelectorAll('tbody tr');

  const headings = [...t_headings].map(head => {
    let actual_head = head.textContent.trim().split(' ');
    return actual_head.splice(0, actual_head.length - 1).join(' ').toLowerCase();
  });

  t_rows.forEach(row => {
    const row_object = {};
    const t_cells = row.querySelectorAll('td');

    t_cells.forEach((t_cell, cell_index) => {
      const img = t_cell.querySelector('img');
      if (img) {
        row_object['user image'] = decodeURIComponent(img.src);
      }
      row_object[headings[cell_index]] = t_cell.textContent.trim();
    });

    table_data.push(row_object);
  });

  return table_data;
};


// Function to convert HTML table to CSV
const toCSV = function(table) {
  const t_heads = table.querySelectorAll('th');
  const tbody_rows = table.querySelectorAll('tbody tr');

  const headings = [...t_heads].map(head => {
    let actual_head = head.textContent.trim().split(' ');
    return actual_head.splice(0, actual_head.length - 1).join(' ').toLowerCase();
  });

  const table_data = [...tbody_rows].map(row => {
    const cells = row.querySelectorAll('td');
    const img = row.querySelector('img');
    const imgSrc = img ? decodeURIComponent(img.src) : '';
    const data_without_img = [...cells].map(cell => cell.textContent.replace(/,/g, ".").trim());

    if (imgSrc !== '') {
      data_without_img.push(imgSrc);
    }

    return data_without_img;
  });

  const csvData = [headings].concat(table_data);

  return csvData;
};


// Function to convert HTML table to Excel
const toExcel = function(table, includeImages = false) {
  const t_heads = table.querySelectorAll('th');
  const tbody_rows = table.querySelectorAll('tbody tr');

  const headings = [...t_heads].map(head => {
    const text = head.textContent.trim();
    const cleanText = text.slice(0, -1); // Remove last character from the text
    const capitalizedText = cleanText.replace(/\b\w/g, (match) => match.toUpperCase()); // Capitalize first letter of each word
    return capitalizedText;
  });

  const hasImages = includeImages && table.querySelector('img') !== null;

  const table_data = [...tbody_rows].map(row => {
    const cells = row.querySelectorAll('td');

    if (hasImages) {
      const img = row.querySelector('img').src;
      const linkFormula = `=HYPERLINK("${img.replace(/\\/g, '/')}", "View Image")`; // Create hyperlink formula
      return [...cells].map(cell => cell.textContent.trim()).concat(linkFormula);
    } else {
      return [...cells].map(cell => cell.textContent.trim());
    }
  });

  if (hasImages) {
    headings.push('Image Link'); // Add "Image Link" header
  }

  const workbook = XLSX.utils.book_new(); // Create a new workbook
  const worksheet = XLSX.utils.aoa_to_sheet([headings].concat(table_data)); // Convert the data to worksheet format
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1'); // Add the worksheet to the workbook

  const excelData = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' }); // Generate Excel data

  return excelData;
};


// Function to convert HTML table to PDF
const toPDF = function(table) {
  const html_code = `
    <link rel="stylesheet" href="tablecss.css">
    <main class="table">${table.innerHTML}</main>
  `;

  const new_window = window.open();
  new_window.document.write(html_code);

  setTimeout(() => {
    new_window.print();
    new_window.close();
  }, 500);
};

// Function to download file
const downloadFile = function(data, fileType, fileName = '') {
  const a = document.createElement('a');
  a.download = fileName;
  const mime_types = {
    json: 'application/json',
    csv: 'text/csv',
    excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  };

  const fileData =
    fileType === 'json' ? JSON.stringify(data, null, 4) :
    fileType === 'csv' ? data.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n') :
    data;

  const blob = new Blob([fileData], { type: mime_types[fileType] });
  a.href = URL.createObjectURL(blob);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

// Bind click event for JSON button
const json_btn = document.querySelector('#jsonBtn');
json_btn.onclick = () => {
  const tableData = toJSON(SEOTable);
  downloadFile(tableData, 'json', 'SEO_Data.json');
};

// Bind click event for CSV button
const csv_btn = document.querySelector('#csvBtn');
csv_btn.onclick = () => {
  const tableData = toCSV(SEOTable);
  downloadFile(tableData, 'csv', 'SEO_Data.csv');
};

// Bind click event for Excel button
const excel_btn = document.querySelector('#excelBtn');
excel_btn.onclick = () => {
  const includeImages = false; // Set this to true if you want to include image links, false or omit for a simple table
  const tableData = toExcel(tabletoExport, includeImages);
  downloadFile(tableData, 'excel', 'SEO_Data.xlsx');
};

// Bind click event for PDF button
const pdf_btn = document.querySelector('#pdfBtn');
pdf_btn.onclick = () => {
  toPDF(SEOTable);
};

