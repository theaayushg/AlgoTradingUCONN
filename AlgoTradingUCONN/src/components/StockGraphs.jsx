import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { format, addDays, parseISO, isToday } from 'date-fns';
import 'chartjs-adapter-date-fns';

const DefaultGraph = ({ selectStock, stockData, predict, predictDisplay }) => {
  const chartRef = useRef(null);
  const [selectedStockClosePrice, setSelectedStockClosePrice] = useState(0);

  useEffect(() => {
    const selectedStock = stockData.find(stock => stock.name === selectStock);
    if (selectedStock) {
      setSelectedStockClosePrice(selectedStock.c);
    }
  }, [selectStock, stockData]);

  useEffect(() => {
    if (selectStock) {
      fetchData();
    }
  }, [selectStock, selectedStockClosePrice, predictDisplay]);

  const fetchData = async () => {
    try {
      const userRef = doc(db, 'CSV', selectStock);
      const userDoc = await getDoc(userRef);
      const stockHistoryData = userDoc.data();

      const dates = Object.keys(stockHistoryData).map(dateString => parseISO(dateString));
      const closePrices = Object.values(stockHistoryData).map(price => parseFloat(price));

      const dataPoints = dates.map((date, index) => ({
        x: date,
        y: closePrices[index]
      }));

      dataPoints.sort((a, b) => a.x - b.x);

      const sortedDates = dataPoints.map(dataPoint => dataPoint.x);
      const sortedClosePrices = dataPoints.map(dataPoint => dataPoint.y);

      const labels = [...sortedDates];
      if (isToday(sortedDates[sortedDates.length - 1])) {
        const todayPriceIndex = sortedDates.length - 1;
        setSelectedStockClosePrice(sortedClosePrices[todayPriceIndex]);
      }
      labels.push(format(new Date(), 'yyyy-MM-dd'));
      if (predictDisplay) {
        const tomorrow = addDays(new Date(), 1);
        labels.push(format(tomorrow, 'yyyy-MM-dd'));
      }

      const predictionData = Array(labels.length - 1).fill(null);
      if (predictDisplay && predict) {
        predictionData.push(predict);
      } else {
        predictionData.push(null);
      }

      if (chartRef.current) {
        chartRef.current.destroy();
      }

      Chart.register(...registerables);
      const ctx = document.getElementById('chart').getContext('2d');
      chartRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Close Price',
              data: [...sortedClosePrices, selectedStockClosePrice],
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 1)',
              tension: 0.1
            },
            {
              label: 'Prediction',
              data: predictionData,
              borderColor: 'rgba(255, 99, 132, 1)',
              backgroundColor: 'rgba(255, 99, 132, 1)',
              tension: 0.1
            }
          ]
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: 'Stock Price Trend',
              font: {
                size: 16
              }
            },
            legend: {
              display: true,
              position: 'bottom'
            }
          },
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'day',
                tooltipFormat: 'yyyy-MM-dd'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Close Price'
              }
            }
          }
        }
      });
    } catch (error) {
      console.error('Error fetching or parsing data:', error);
    }
  };

  return (
    <div className="graph-container">
      <canvas id="chart" className='graph' />
    </div>
  );
};

const StockGraphs = ({ selectStock, stockData, predictDisplay }) => {
  const [predict, setPredict] = useState();

  useEffect(() => {
    if (selectStock) {
      getPredictions();
    }
  }, [selectStock]);

  const getPredictions = async () => {
    try {
      const tomorrow = addDays(new Date(), 1);
      const year = tomorrow.getFullYear();
      const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
      const day = String(tomorrow.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      const userRef = doc(db, 'Prediction', formattedDate);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const predictions = userDoc.data();
        if (predictions[selectStock]) {
          const predictionValue = predictions[selectStock];
          setPredict(predictionValue);
        } else {
          setPredict();
          console.log(`No prediction found for ${selectStock}`);
        }
      } else {
        setPredict();
        console.log('Prediction document does not exist');
      }
    } catch (error) {
      console.error('Error fetching predictions:', error);
    }
  };

  return (
    <div className="StockGraph-container">
      <h1>{selectStock}'s Graph</h1>
      <h3>Tomorrow's prediction is {predict}</h3>
      <div className='StockGraph-graph'>
        <DefaultGraph selectStock={selectStock} stockData={stockData} predict={predict} predictDisplay={predictDisplay} />
      </div>
    </div>
  );
};

export default StockGraphs;
