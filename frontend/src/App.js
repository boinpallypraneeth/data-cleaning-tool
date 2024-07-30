import React, { useState } from 'react';
import UploadComponent from './components/UploadComponent';
import DataCleaningComponent from './components/DataCleaningComponent';
import VisualizationComponent from './components/VisualizationComponent';
import './App.css';

function App() {
  const [data, setData] = useState(null);
  const [cleanedData, setCleanedData] = useState(null);

  const handleFileUpload = (uploadedData) => {
    setData(uploadedData);
  };

  const handleCleanData = (cleanedData) => {
    setCleanedData(cleanedData);
  };

  return (
    <div className="app-container">
      <h1>Data Cleaning and Visualization Tool</h1>
      <UploadComponent onFileUpload={handleFileUpload} />
      {data && <DataCleaningComponent data={data} onCleanData={handleCleanData} />}
      {cleanedData && <VisualizationComponent data={cleanedData} />}
    </div>
  );
}

export default App;
