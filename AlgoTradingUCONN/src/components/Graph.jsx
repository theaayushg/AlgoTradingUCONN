import React, { useEffect, useRef, useState } from 'react';
import {Line} from 'react-chartjs-2'
import './Graph.css';
// import Chart from 'chart.js/auto';
// import {db} from '../services/firebase';

function Graph() {

    // const getMyStocks = () => {
    //     db
    //     .collection('stocks')
    //     .onSnapshot(snapshot => {
    //         console.log(snapshot);
    //     });
    // };
    
    //getMyStocks();
    const applStockData = {
      date: [],
      close: [],
      open: [],
      high: [],
      low: [],
      volume: []
    };
    
    // Set initial values for the first day
    let previousClose = 100; // Initial closing price
    let previousHigh = 110; // Initial high price
    let previousLow = 90; // Initial low price
    
    for (let i = 0; i < 100; i++) {
      // Generate date
      const currentDate = new Date('2023-01-01');
      currentDate.setDate(currentDate.getDate() + i);
      const dateString = currentDate.toISOString().slice(0, 10);
      applStockData.date.push(dateString);
      
      // Generate opening price with reduced volatility
      const openingDiff = (Math.random() - 0.5) * 2; // Random change within +/- 2
      let openingPrice = previousClose + openingDiff;
      openingPrice = Math.max(openingPrice, previousLow); // Ensure opening price is not lower than previous low
      openingPrice = Math.min(openingPrice, previousHigh); // Ensure opening price is not higher than previous high
      applStockData.open.push(openingPrice);
    
      // Generate closing price with reduced volatility
      const closingDiff = (Math.random() - 0.5) * 2; // Random change within +/- 2
      let closingPrice = openingPrice + closingDiff;
      closingPrice = Math.max(closingPrice, previousLow); // Ensure closing price is not lower than previous low
      closingPrice = Math.min(closingPrice, previousHigh); // Ensure closing price is not higher than previous high
      applStockData.close.push(closingPrice);
      
      // Generate high price with reduced volatility
      const highDiff = Math.random() * 5; // Random change up to 5
      const highPrice = Math.max(openingPrice, closingPrice) + highDiff;
      applStockData.high.push(highPrice);
      
      // Generate low price with reduced volatility
      const lowDiff = Math.random() * 5; // Random change up to 5
      const lowPrice = Math.min(openingPrice, closingPrice) - lowDiff;
      applStockData.low.push(lowPrice);
      
      // Update previous prices for next iteration
      previousClose = closingPrice;
      previousHigh = highPrice;
      previousLow = lowPrice;
      
      // Generate volume
      applStockData.volume.push(Math.random() * 100000);
    }
    
    // const [chartInstance, setChartInstance] = useState(null);
    // const [containerWidth, setContainerWidth] = useState(0);
    // const canvasRef = useRef(null);

    // useEffect(() => {
    //     const handleResize = () => {
    //         const width = canvasRef.current.parentElement.clientWidth;
    //         setContainerWidth(width);
    //     };

    //     handleResize();

    //     window.addEventListener('resize', handleResize);

    //     return () => {
    //         window.removeEventListener('resize', handleResize);
    //     };
    // }, []);

    // useEffect(() => {
    //     if (!containerWidth) return;

    //     if (chartInstance) {
    //         chartInstance.destroy();
    //     }

    //     const ctx = canvasRef.current.getContext('2d');
    //     const newChartInstance = new Chart(ctx, {
    //         type: 'line',
    //         data: {
    //             labels: applStockData.date,
    //             datasets: [{
    //                 label: 'My First Dataset',
    //                 data: applStockData.close,
    //                 backgroundColor: 'rgba(255, 99, 132, 0.2)',
    //                 borderColor: 'rgba(255, 99, 132, 1)',
    //                 borderWidth: 1
    //             }]
    //         },
    //         options: {
    //             responsive: true,
    //             maintainAspectRatio: false
    //         }
    //     });
    //     setChartInstance(newChartInstance);
    // }, [containerWidth]);

    const data = {
        datasets: [
            {
                type: "line",
                data: applStockData.date.map((date,index) => ({
                    x:date,
                    y:applStockData.close[index]
                }))
            }
        ]
    };
    return (
        <div className='linegraph'>
            {/* <canvas ref={canvasRef}></canvas> */}
            <Line data={data}/>
        </div>
    );
}

export default Graph;
