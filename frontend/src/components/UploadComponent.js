import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';

function UploadComponent({ onFileUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert('No file selected!');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    axios.post('http://localhost:5000/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(response => {
      onFileUpload(response.data);
    })
    .catch(error => {
      console.error('Error uploading file:', error);
    });
  };

  return (
    <div className="upload-container">
      <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileChange} />
      {selectedFile && <p>File selected: {selectedFile.name}</p>}
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default UploadComponent;
