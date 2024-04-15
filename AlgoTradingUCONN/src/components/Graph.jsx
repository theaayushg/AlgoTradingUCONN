import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import StockPrediction from './StockPrediction.jsx';
import { ChromePicker } from 'react-color';
import "../styles/Graph.css"

function Graph({ user_portfolio }) {
  const [chartInstance, setChartInstance] = useState(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [backgroundColor, setBackgroundColor] = useState({ r: 140, g: 167, b: 167, a: 1 });
  const [barColor, setBarColor] = useState({ r: 54, g: 162, b: 235, a: 1 });
  const [textColor, setTextColor] = useState({ r: 0, g: 0, b: 0, a: 1 });
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
          backgroundColor: `rgba(${barColor.r}, ${barColor.g}, ${barColor.b}, ${barColor.a})`,
          borderColor: `rgba(${barColor.r}, ${barColor.g}, ${barColor.b}, ${barColor.a})`,
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
              color: `rgba(${textColor.r}, ${textColor.g}, ${textColor.b}, ${textColor.a})`
            },
            ticks: {
              color: `rgba(${textColor.r}, ${textColor.g}, ${textColor.b}, ${textColor.a})`
            }
          },
          x: {
            title: {
              display: true,
              text: 'Ticker',
              color: `rgba(${textColor.r}, ${textColor.g}, ${textColor.b}, ${textColor.a})`
            },
            beginAtZero: true,
            ticks: {
              color: `rgba(${textColor.r}, ${textColor.g}, ${textColor.b}, ${textColor.a})`
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              font: {
                color: `rgba(${textColor.r}, ${textColor.g}, ${textColor.b}, ${textColor.a})`
              }
            }
          }
        }
      }
    });

    // Set background color of the canvas
    ctx.canvas.style.backgroundColor = `rgba(${backgroundColor.r}, ${backgroundColor.g}, ${backgroundColor.b}, ${backgroundColor.a})`;

    setChartInstance(newChartInstance);
  }, [containerWidth, user_portfolio, barColor, textColor, backgroundColor]);

  StockPrediction("AMZN");

  const handleBackgroundColorChange = (color) => {
    setBackgroundColor(color.rgb);
  };

  const handleBarColorChange = (color) => {
    setBarColor(color.rgb);
  };

  const handleTextColorChange = (color) => {
    setTextColor(color.rgb);
  };

  return (
    <div>
      <div className='bargraph'>
        <canvas ref={canvasRef}></canvas>
      </div>
      <div className='customs'>
        <label>Background Color:</label>
        <ChromePicker color={backgroundColor} onChange={handleBackgroundColorChange} />
        <label>Bar Color:</label>
        <ChromePicker color={barColor} onChange={handleBarColorChange} />
        <label>Text Color:</label>
        <ChromePicker color={textColor} onChange={handleTextColorChange} />
      </div>
    </div>
  );
}

export default Graph;
