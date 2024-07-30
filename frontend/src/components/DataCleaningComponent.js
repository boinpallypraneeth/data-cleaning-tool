import React, { useState } from 'react';

function DataCleaningComponent({ data, onCleanData }) {
  const [options, setOptions] = useState({
    removeDuplicates: true,
    fillForward: true,
    fillBackward: true,
    standardizeDates: true,
  });

  const handleOptionChange = (e) => {
    const { name, checked } = e.target;
    setOptions(prevOptions => ({
      ...prevOptions,
      [name]: checked,
    }));
  };

  const handleCleanData = () => {
    fetch('http://localhost:5000/clean', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data, options }),
    })
    .then(response => response.json())
    .then(cleanedData => {
      onCleanData(cleanedData);
    })
    .catch(error => {
      console.error('Error cleaning data:', error);
    });
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
      <div className="options">
        <label>
          <input
            type="checkbox"
            name="removeDuplicates"
            checked={options.removeDuplicates}
            onChange={handleOptionChange}
          />
          Remove Duplicates
        </label>
        <label>
          <input
            type="checkbox"
            name="fillForward"
            checked={options.fillForward}
            onChange={handleOptionChange}
          />
          Fill Forward Missing Values
        </label>
        <label>
          <input
            type="checkbox"
            name="fillBackward"
            checked={options.fillBackward}
            onChange={handleOptionChange}
          />
          Fill Backward Missing Values
        </label>
        <label>
          <input
            type="checkbox"
            name="standardizeDates"
            checked={options.standardizeDates}
            onChange={handleOptionChange}
          />
          Standardize Date Formats
        </label>
      </div>
      <button onClick={handleCleanData}>Clean Data</button>
      <button onClick={() => downloadCSV(data)}>Download Cleaned Data</button>
    </div>
  );
}

export default DataCleaningComponent;
