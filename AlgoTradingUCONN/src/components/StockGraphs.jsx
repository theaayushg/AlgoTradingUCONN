// import React, { useEffect, useRef } from 'react';
// import { Chart, registerables } from 'chart.js';
// import Papa from 'papaparse'; // Library for parsing CSV data
// import "../styles/StockGraphs.css"

// const DefaultGraph = ({ selectedStock }) => {
//   const chartRef = useRef(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Construct URL based on the selected stock
//         const response = await fetch(`./src/assets/csv/${selectedStock}_stock_data.csv`);
//         const csvData = await response.text(); // Get CSV data as text
//         const parsedData = Papa.parse(csvData, {
//           header: true,
//           skipEmptyLines: true, // Skip empty lines
//           transform: (value, header) => {
//             // Convert 'Close' values to numbers
//             if (header === 'Close') {
//               return Number(value);
//             }
//             return value;
//           }
//         }).data;
//         const dates = parsedData.map(item => item.Date);
//         const closePrices = parsedData.map(item => parseFloat(item.Close));

//         if (chartRef.current) {
//           chartRef.current.data.labels = dates;
//           chartRef.current.data.datasets[0].data = closePrices;
//           chartRef.current.update();
//         } else {
//           Chart.register(...registerables);
//           const ctx = document.getElementById('chart').getContext('2d');
//           chartRef.current = new Chart(ctx, {
//             type: 'line',
//             data: {
//               labels: dates,
//               datasets: [{
//                 label: 'Close Price',
//                 data: closePrices,
//                 borderColor: 'rgba(75, 192, 192, 1)',
//                 tension: 0.1
//               }]
//             }
//           });
//         }
//       } catch (error) {
//         console.error('Error fetching or parsing data:', error);
//       }
//     };

//     fetchData();

//     return () => {
//       if (chartRef.current) {
//         chartRef.current.destroy();
//         chartRef.current = null;
//       }
//     };
//   }, [selectedStock]);

//   return (
//     <div className="graph-container">
//       <canvas id="chart" className='graph' />
//     </div>
//   );
// };

// const StockGraphs = ({ selectedStock }) => {
//   return (
//     <div className="StockGraph-container">
//       <h1>Stock Graphs</h1>
//       <div className='StockGraph-graph'>
//         <DefaultGraph selectedStock={selectedStock} />
//       </div>
//     </div>
//   );
// };

// export default StockGraphs;


import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import Papa from 'papaparse'; // Library for parsing CSV data
import "../styles/StockGraphs.css"
import { doc, getDoc } from "firebase/firestore";
import {db} from "../services/firebase"
import stockgraphicon from '../assets/stock-chart.svg';



const DefaultGraph = ({ selectStock }) => {
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
        const dates = parsedData.map(item => item.Date);
        const closePrices = parsedData.map(item => parseFloat(item.Close));

        if (chartRef.current) {
          chartRef.current.data.labels = dates;
          chartRef.current.data.datasets[0].data = closePrices;
          chartRef.current.update();
        } else {
          Chart.register(...registerables);
          const ctx = document.getElementById('chart').getContext('2d');
          chartRef.current = new Chart(ctx, {
            type: 'line',
            data: {
              labels: dates,
              datasets: [{
                label: 'Close Price',
                data: closePrices,
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
  }, [selectStock]);

  return (
    <div className="graph-container">
      <canvas id="chart" className='graph' />
    </div>
  );
};

const StockGraphs = ({selectStock}) => {
  const [predict,setPredict]= useState([]);
  useEffect(() => {
    if (selectStock) {
      getPredictions();
    }
  }, [selectStock]);

  const getPredictions = async () => {
    let promises = [];
    let tempData = [];

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding 1 because January is 0
    const day = String(currentDate.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    const userRef = doc(db, 'Prediction', "thAPOPICgraAsrixe2kK");
    const userDoc = await getDoc(userRef);

    if (userDoc && userDoc.data()[formattedDate]) {
      const predictions = userDoc.data()[formattedDate];
      Object.keys(predictions).forEach(ticker => {
        const cur_predictions = predictions[ticker];
        promises.push(
          (res) => {
            tempData.push({
              ticker: ticker,
              prediction: cur_predictions[ticker],
              info: res.data,
            });
          });
        });

      Promise.all(promises)
        .then(() => {
          setPredict(tempData);
        })
        .catch(error => {
          console.error('Error fetching stock data:', error);
        });
    }
  };
  console.log(predict);

  return (
    <div className="StockGraph-container">
      <h1>{selectStock}'s Graph</h1>
      <div className='StockGraph-graph'>
        <DefaultGraph selectStock={selectStock} />
      </div>
    </div>
  );
};

export default StockGraphs;
