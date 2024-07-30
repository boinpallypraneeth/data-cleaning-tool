/* eslint-disable no-restricted-globals */

self.onmessage = function(e) {
    const { action, data } = e.data;
  
    if (action === 'processData') {
      const processedData = processData(data);
      self.postMessage({ action: 'processedData', data: processedData });
    }
  };
  
  function processData(data) {
    // Implement your data processing logic here if needed
    return data;
  }
  
  /* eslint-enable no-restricted-globals */
  