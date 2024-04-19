import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import Papa from 'papaparse'; // Library for parsing CSV data
import "../styles/StockGraphs.css"
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import stockgraphicon from '../assets/stock-chart.svg';

const DefaultGraph = ({ selectStock, user_portfolio, predict }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Construct URL based on the selected stock
        const response = await fetch(`./src/assets/csv/${selectStock}_stock_data.csv`);
        const csvData = await response.text(); // Get CSV data as text
        const parsedData = Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true, // Skip empty lines
          transform: (value, header) => {
            // Convert 'Close' values to numbers
            if (header === 'Close') {
              return Number(value);
            }
            return value;
          }
        }).data;

        // Extracting data from the user portfolio and prediction
        const portfolioDate = new Date();
        const portfolioYear = portfolioDate.getFullYear();
        const portfolioMonth = String(portfolioDate.getMonth() + 1).padStart(2, '0');
        const portfolioDay = String(portfolioDate.getDate()).padStart(2, '0');
        const portfolioFormattedDate = `${portfolioYear}-${portfolioMonth}-${portfolioDay}`;

        const predictionDate = new Date();
        predictionDate.setDate(predictionDate.getDate() + 1);
        const predictionYear = predictionDate.getFullYear();
        const predictionMonth = String(predictionDate.getMonth() + 1).padStart(2, '0');
        const predictionDay = String(predictionDate.getDate()).padStart(2, '0');
        const predictionFormattedDate = `${predictionYear}-${predictionMonth}-${predictionDay}`;

        const dates = parsedData.map(item => item.Date);
        const closePrices = parsedData.map(item => parseFloat(item.Close));
        const userPortfolioPrice = user_portfolio ? user_portfolio[selectStock] : null;
        const predictionPrice = predict && predict[selectStock] ? predict[selectStock] : null;

        if (chartRef.current) {
          chartRef.current.data.labels = [...dates, portfolioFormattedDate, predictionFormattedDate];
          chartRef.current.data.datasets[0].data = [...closePrices, userPortfolioPrice, predictionPrice];
          chartRef.current.update();
        } else {
          Chart.register(...registerables);
          const ctx = document.getElementById('chart').getContext('2d');
          chartRef.current = new Chart(ctx, {
            type: 'line',
            data: {
              labels: [...dates, portfolioFormattedDate, predictionFormattedDate],
              datasets: [{
                label: 'Close Price',
                data: [...closePrices, userPortfolioPrice, predictionPrice],
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1
              }]
            }
          });
        }
      } catch (error) {
        console.error('Error fetching or parsing data:', error);
      }
    };

    fetchData();

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [selectStock, user_portfolio, predict]);

  return (
    <div className="graph-container">
      <canvas id="chart" className='graph' />
    </div>
  );
};

const StockGraphs = ({ selectStock, user_portfolio }) => {
  const [predict, setPredict] = useState();

  useEffect(() => {
    if (selectStock) {
      getPredictions();
    }
  }, [selectStock]);

  const getPredictions = async () => {
    try {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 1);
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      const userRef = doc(db, 'Prediction', formattedDate);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const predictions = userDoc.data();
        if (predictions[selectStock]) {
          // Extract the prediction value for the selected stock ticker
          const predictionValue = predictions[selectStock];
          setPredict({ [selectStock]: predictionValue });
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
      <h3>Tomorrow's prediction is {predict && predict[selectStock]}</h3>
      <div className='StockGraph-graph'>
        <DefaultGraph selectStock={selectStock} user_portfolio={user_portfolio} predict={predict} />
      </div>
    </div>
  );
};

export default StockGraphs;
