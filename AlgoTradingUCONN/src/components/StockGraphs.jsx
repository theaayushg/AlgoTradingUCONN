import React, { useEffect, useState } from 'react';
import 'chartjs-adapter-date-fns';
import { Chart, registerables } from 'chart.js';
import Papa from 'papaparse'; // Library for parsing CSV data
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { format, addDays } from 'date-fns';

const DefaultGraph = ({ selectStock, stockData, predict, predictDisplay }) => {
  const chartRef = useRef(null);
  const [selectedStockClosePrice, setSelectedStockClosePrice] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`./src/assets/csv/${selectStock}_stock_data.csv`);
        const csvData = await response.text();
        const parsedData = Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
          transform: (value, header) => {
            if (header === 'Close') {
              return Number(value);
            }
            return value;
          }
        }).data;

        const dates = parsedData.map(item => item.Date);
        const closePrices = parsedData.map(item => parseFloat(item.Close));

        let graphColor = 'rgba(75, 192, 192, 1)';

        if (closePrices[closePrices.length - 1] > selectedStockClosePrice) {
          graphColor = 'rgba(192, 75, 75, 1)';
        }

        const labels = [...dates];
        labels.push(format(new Date(), 'yyyy-MM-dd'));

        if (predictDisplay && predict) {
          const tomorrow = addDays(new Date(), 1);
          labels.push(format(tomorrow, 'yyyy-MM-dd'));
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
            datasets: [{
              label: 'Close Price',
              data: [...closePrices, selectedStockClosePrice, predict],
              borderColor: graphColor,
              backgroundcolor: graphColor,
              tension: 0.1
            }]
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
                title: {
                  display: true,
                  text: 'Date'
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

    fetchData();

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [selectStock, stockData, predict, selectedStockClosePrice, predictDisplay]);

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
      const currentDate = new Date();
      const tomorrow = addDays(currentDate, 1);
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
      {predictDisplay && predict && <h3>Tomorrow's prediction is {predict}</h3>}
      <div className='StockGraph-graph'>
        <DefaultGraph selectStock={selectStock} stockData={stockData} predict={predict} predictDisplay={predictDisplay} />
      </div>
    </div>
  );
};

export default StockGraphs;
