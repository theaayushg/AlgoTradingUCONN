import React, { useEffect, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import Papa from 'papaparse'; // Library for parsing CSV data
import { csv } from 'd3-fetch'; // Library for fetching CSV data

const tickers = ['AAPL', 'MSFT', 'JNJ', 'PG', 'KO', 'XOM', 'WMT', 'IBM', 'GE', 'F', 'GOOGL', 'AMZN', 'META', 'TSLA', 'NFLX', 'INTC', 'AMD', 'NVDA', 'V', 'PYPL'];

const StockGraph = ({ ticker }) => {
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await csv(`../assets/csv/${ticker}_stock_data.csv`);
        const parsedData = Papa.parse(response, { header: true }).data;
        const dates = parsedData.map(item => item.date);
        const closePrices = parsedData.map(item => parseFloat(item.close));

        if (chartInstance) {
          chartInstance.destroy();
        }

        Chart.register(...registerables);
        const ctx = document.getElementById('chart').getContext('2d');
        const newChartInstance = new Chart(ctx, {
          type: 'line',
          data: {
            labels: dates,
            datasets: [{
              label: 'Close Price',
              data: closePrices,
              borderColor: 'rgba(75, 192, 192, 1)',
              tension: 0.1
            }]
          }
        });

        setChartInstance(newChartInstance);
      } catch (error) {
        console.error('Error fetching or parsing data:', error);
      }
    };

    fetchData();

    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [ticker]);

  return (
    <div className="graph-container">
      <canvas id="chart" />
    </div>
  );
};

const App = () => {
  const [selectedTicker, setSelectedTicker] = useState(tickers[0]);

  const handleTickerChange = (event) => {
    setSelectedTicker(event.target.value);
  };

  return (
    <div className="app-container">
      <h1>Stock Graph</h1>
      <select value={selectedTicker} onChange={handleTickerChange}>
        {tickers.map(ticker => (
          <option key={ticker} value={ticker}>{ticker}</option>
        ))}
      </select>
      <StockGraph ticker={selectedTicker} />
    </div>
  );
};

export default App;
