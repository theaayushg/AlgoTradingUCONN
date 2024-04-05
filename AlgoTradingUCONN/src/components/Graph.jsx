import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';

const TOKEN = "cnd3ll1r01qr85dtaltgcnd3ll1r01qr85dtalu0";
const BASE_URL = "https://finnhub.io/api/v1/quote";

function Graph({ user }) {
  const [chartInstance, setChartInstance] = useState(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [portfolioData, setPortfolioData] = useState([]);
  const canvasRef = useRef(null);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      const stocksList = ['AAPL', 'MSFT', 'JNJ', 'PG', 'KO', 'XOM', 'WMT', 'IBM', 'GE', 'F', 'GOOGL', 'AMZN', 'META', 'TSLA', 'NFLX', 'INTC', 'AMD', 'NVDA', 'V', 'PYPL'];
      const promises = [];

      for (const stock of stocksList) {
        promises.push(
          axios.get(`${BASE_URL}?symbol=${stock}&token=${TOKEN}`)
            .then(res => ({
              ticker: stock,
              value: res.data.c, // Assuming you're fetching the closing price
            }))
            .catch(error => console.error("Error fetching stock data:", error))
        );
      }

      Promise.all(promises)
        .then(data => {
          setPortfolioData(data);
        });
    };

    fetchPortfolioData();
  }, [user]);

  useEffect(() => {
    const handleResize = () => {
      const width = canvasRef.current.parentElement.clientWidth;
      setContainerWidth(width);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (!containerWidth || !portfolioData.length) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    Chart.register(...registerables);

    const ctx = canvasRef.current.getContext('2d');
    const newChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: portfolioData.map(item => item.ticker),
        datasets: [{
          label: 'Portfolio Value',
          data: portfolioData.map(item => item.value),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Portfolio Value ($)'
            }
          }
        }
      }
    });

    setChartInstance(newChartInstance);
  }, [containerWidth, portfolioData, chartInstance]);

  return (
    <div>
      <div className='bargraph'>
        <canvas ref={canvasRef}></canvas>
      </div>
      <div>
        {/* Display Ticker symbol and value for each stock */}
        {portfolioData.map((stock) => (
          <div key={stock.ticker}>
            <p>{stock.ticker}: ${stock.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Graph;
