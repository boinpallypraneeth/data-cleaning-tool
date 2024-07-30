import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend, ArcElement } from 'chart.js';

// Register necessary components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  ArcElement
);

const generateColors = (numColors) => {
  const colors = [];
  for (let i = 0; i < numColors; i++) {
    const hue = (i * 360) / numColors;
    colors.push(`hsl(${hue}, 70%, 50%)`);
  }
  return colors;
};

function VisualizationComponent({ data }) {
  const [chartType, setChartType] = useState('bar');
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState({});
  const [clickedData, setClickedData] = useState(null);
  const [selectedLabel, setSelectedLabel] = useState(null);
  const workerRef = useRef(null);

  const setProcessedData = useCallback((data) => {
    const columns = Object.keys(data[0]);
    const numericColumns = columns.filter(key => !isNaN(data[0][key]));

    const labels = data.map((item, index) => item.id || `Item ${index + 1}`); // Use 'id' or generate labels
    const colors = generateColors(labels.length);

    const datasets = numericColumns.map((col, index) => ({
      label: col,
      data: data.map(item => item[col]),
      backgroundColor: colors,
      borderColor: colors,
      borderWidth: 1,
    }));

    setChartData({
      labels,
      datasets,
    });

    setChartOptions({
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: 'white', // Ensure legend text is visible on dark background
            boxWidth: 20,
            padding: 10,
          },
        },
        title: {
          display: true,
          text: 'Data Visualization',
          color: 'white', // Ensure title text is visible on dark background
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              return `${tooltipItem.label}: ${tooltipItem.raw}`;
            }
          }
        }
      },
      scales: chartType === 'pie' ? {} : {
        x: {
          title: {
            display: true,
            text: 'Items',
            color: 'white', // Ensure axis title text is visible on dark background
          },
          ticks: {
            color: 'white', // Ensure x-axis ticks are visible on dark background
          },
        },
        y: {
          title: {
            display: true,
            text: 'Values',
            color: 'white', // Ensure axis title text is visible on dark background
          },
          ticks: {
            color: 'white', // Ensure y-axis ticks are visible on dark background
          },
        },
      },
      layout: {
        padding: {
          left: 10,
          right: 10,
          top: 10,
          bottom: 10,
        },
      },
      onClick: (evt, element) => {
        if (chartData && element.length > 0) {
          const { datasetIndex, index } = element[0];
          const label = chartData.labels[index];
          const value = chartData.datasets[datasetIndex].data[index];
          setClickedData({ label, value });
          setSelectedLabel(label); // Set the selected label
        }
      },
      hover: {
        mode: 'nearest',
        intersect: true,
      },
    });
  }, [chartType, chartData]);

  useEffect(() => {
    if (typeof Worker !== 'undefined') {
      workerRef.current = new Worker(new URL('../dataWorker.js', import.meta.url)); // Correct path here
      workerRef.current.onmessage = (e) => {
        const { action, data } = e.data;
        if (action === 'processedData') {
          setProcessedData(data);
        }
      };
    }
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, [setProcessedData]);

  useEffect(() => {
    if (data && data.length > 0) {
      workerRef.current.postMessage({ action: 'processData', data });
    }
  }, [data]);

  const handleLabelClick = (label) => {
    setSelectedLabel(label);
    const index = chartData.labels.indexOf(label);
    if (index !== -1) {
      const datasetIndex = 0; // Assuming the first dataset
      const value = chartData.datasets[datasetIndex].data[index];
      setClickedData({ label, value });
    }
  };

  return (
    <div className="visualization-section">
      <h2>Data Visualization</h2>
      <div className="chart-options">
        <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
          <option value="bar">Bar Chart</option>
          <option value="line">Line Chart</option>
          <option value="pie">Pie Chart</option>
        </select>
      </div>
      <div className="chart-layout">
        {chartType !== 'pie' && chartData && (
          <div className="chart-labels">
            {chartData.labels.map((label, index) => (
              <div
                key={index}
                className={`chart-label ${label === selectedLabel ? 'selected' : ''}`}
                onClick={() => handleLabelClick(label)}
              >
                {label}
              </div>
            ))}
          </div>
        )}
        <div className="chart-container">
          {chartType === 'bar' && chartData && <Bar data={chartData} options={chartOptions} />}
          {chartType === 'line' && chartData && <Line data={chartData} options={chartOptions} />}
          {chartType === 'pie' && chartData && <Pie data={chartData} options={chartOptions} />}
        </div>
      </div>
      {clickedData && (
        <div className="clicked-data">
          <p><strong>Clicked Data:</strong></p>
          <p>Label: {clickedData.label}</p>
          <p>Value: {clickedData.value}</p>
        </div>
      )}
    </div>
  );
}

export default VisualizationComponent;
