import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import StockPrediction from './StockPrediction.jsx';
import "../styles/Graph.css"

function Graph({ user_portfolio }) {
  const [chartInstance, setChartInstance] = useState(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const canvasRef = useRef(null);

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
    if (!containerWidth || !user_portfolio.length) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    Chart.register(...registerables);

    const ctx = canvasRef.current.getContext('2d');

    // Aggregate data for bar chart
    const labels = user_portfolio.map(stock => stock.ticker);
    const data = user_portfolio.map(stock => stock.numShares * stock.info.c);

    const newChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Total Value',
          data: data,
          backgroundColor: 'rgba(54, 162, 235, 0.8)', // Original bar color
          borderColor: 'rgba(54, 162, 235, 1)', // Original border color
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
              text: 'Total value',
              color: 'rgba(0, 0, 0, 1)' // Original text color
            },
            ticks: {
              color: 'rgba(0, 0, 0, 1)' // Original text color
            }
          },
          x: {
            title: {
              display: true,
              text: 'Ticker',
              color: 'rgba(0, 0, 0, 1)' // Original text color
            },
            beginAtZero: true,
            ticks: {
              color: 'rgba(0, 0, 0, 1)' // Original text color
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              font: {
                color: 'rgba(0, 0, 0, 1)' // Original text color
              }
            }
          }
        }
      }
    });

    // Set background color of the canvas
    ctx.canvas.style.backgroundColor = 'rgba(140, 167, 167, 1)'; // Original background color

    setChartInstance(newChartInstance);
  }, [containerWidth, user_portfolio]);

  StockPrediction("AMZN");

  return (
    <div>
      <div className='bargraph'>
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
}

export default Graph;
