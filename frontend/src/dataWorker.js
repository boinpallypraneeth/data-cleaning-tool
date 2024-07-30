/* eslint-disable no-restricted-globals */

self.onmessage = function(e) {
    const { data, action } = e.data;
  
    if (action === 'processData') {
      const processedData = processData(data);
      self.postMessage({ action: 'processedData', data: processedData });
    }
  };
  
  function processData(data) {
    // Perform your data processing here
    return data; // Return processed data
  }
  