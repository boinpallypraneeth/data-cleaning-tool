import React from 'react';

function DataCleaningComponent({ data, onCleanData }) {
  const handleCleanData = () => {
    if (!data || data.length === 0) return;

    let previousRow = {};
    const cleanedData = data.map(item => {
      const newRow = { ...item };
      for (const key in newRow) {
        if (newRow[key] === '' || newRow[key] === null || newRow[key] === undefined || newRow[key] === 'NA') {
          newRow[key] = previousRow[key];
        }
      }
      previousRow = newRow;
      return newRow;
    });

    onCleanData(cleanedData);
  };

  const downloadCSV = (data) => {
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(',')).join('\n');
    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'cleaned_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="data-cleaning-component">
      <button onClick={handleCleanData}>Clean Data</button>
      <button onClick={() => downloadCSV(data)}>Download Cleaned Data</button>
    </div>
  );
}

export default DataCleaningComponent;
