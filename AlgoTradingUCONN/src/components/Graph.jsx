import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';

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
    const data = user_portfolio.map(stock => stock.numShares * stock.avgSharePrice);

    const newChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Total Value',
          data: data,
          backgroundColor: 'rgba(54, 162, 235, 0.6)', // Blue color for bars
          borderColor: 'rgba(54, 162, 235, 1)',
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
              text: 'Ticker'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Total Value'
            },
            beginAtZero: true
          }
        }
      }
    });

    setChartInstance(newChartInstance);
  }, [containerWidth, user_portfolio]);

  return (
    <div className='bargraph'>
      <canvas ref={canvasRef} className='chartStyle'></canvas>
    </div>
  );
}

export default Graph;
