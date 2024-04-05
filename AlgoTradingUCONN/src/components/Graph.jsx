import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import { doc, getDoc } from "firebase/firestore";
import axios from 'axios';
import { db } from '../services/firebase';

const TOKEN = "cnd3ll1r01qr85dtaltgcnd3ll1r01qr85dtalu0";
const BASE_URL = "https://finnhub.io/api/v1/quote";

function Graph( user ) {
  const [chartInstance, setChartInstance] = useState(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [myStocks, setMyStocks] = useState([]);
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
    const getMyStocks = async (userId) => {
      const userIdString = userId.userid;
      const userRef = doc(db, 'user_test', userIdString);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists() && userDoc.data().Portfolio) {
        const portfolio = userDoc.data().Portfolio;
        const promises = [];

        for (const ticker in portfolio) {
          const cur_stockData = portfolio[ticker];
          promises.push(
            getStockData(ticker)
              .then(res => {
                const value = res.data.c * cur_stockData.Shares;
                return {
                  ticker: ticker,
                  value: value,
                  info: res.data
                };
              })
              .catch(error => {
                console.error(`Error fetching stock data for ${ticker}:`, error);
                return null;
              })
          );
        }

        Promise.all(promises)
          .then(values => {
            const filteredValues = values.filter(value => value !== null);
            setMyStocks(filteredValues);
          })
          .catch(error => {
            console.error('Error fetching stock data:', error);
          });
      }
    };

    const getStockData = async (stock) => {
      return axios.get(`${BASE_URL}?symbol=${stock}&token=${TOKEN}`);
    };

    getMyStocks(user);
  }, []);

  useEffect(() => {
    if (!containerWidth || !myStocks.length || !canvasRef.current) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    Chart.register(...registerables);

    const ctx = canvasRef.current.getContext('2d');
    const newChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: myStocks.map(item => item.ticker),
        datasets: [{
          label: 'Portfolio Value',
          data: myStocks.map(item => item.value),
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
          },
          x: {
            title: {
              display: true,
              text: 'Ticker'
            }
          }
        }
      }
    });

    setChartInstance(newChartInstance);
  }, [containerWidth, myStocks, chartInstance]);

  return (
    <div className='bargraph'>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}

export default Graph;
