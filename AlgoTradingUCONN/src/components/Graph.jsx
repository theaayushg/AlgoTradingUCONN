import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';

function Graph({ user }) {
  const [chartInstance, setChartInstance] = useState(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [portfolioData, setPortfolioData] = useState([]);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (user) {
      const userRef = doc(db, "user_test", user.uid);
      const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const portfolio = docSnapshot.data().Portfolio || {};
          const data = Object.entries(portfolio).map(([ticker, { BuyPrice, Shares }]) => ({
            ticker,
            value: parseFloat(BuyPrice) * parseInt(Shares)
          }));
          setPortfolioData(data);
          console.log('Portfolio Data:', data); // Log portfolioData
        } else {
          console.log("No snapshot available for the user");
        }
      });
  
      return () => unsubscribe(); // Unsubscribe from the listener when the component unmounts
    }
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
  }, [containerWidth, portfolioData]);

  return (
    <div className='bargraph'>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}

export default Graph;
