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
          backgroundColor: 'rgba(75, 192, 192, 1)', // Blue bars
          borderColor: 'rgba(54, 162, 235, 1)', // Blue border color
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
            },
            ticks: {
            }
          },
          x: {
            title: {
              display: true,
              text: 'Ticker',
            },
            beginAtZero: true,
            ticks: {
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              font: {
              }
            }
          }
        }
      }
    });

    // Set background color of the canvas to black
    ctx.canvas.style.backgroundColor = 'black';

    setChartInstance(newChartInstance);
  }, [containerWidth, user_portfolio]);

  return (
    <div>
      <div className='bargraph'>
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
}

export default Graph;
