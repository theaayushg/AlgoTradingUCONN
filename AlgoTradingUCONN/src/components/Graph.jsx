import React, { useEffect, useRef, useState } from 'react';
//import {Line} from 'react-chartjs-2'
import './Graph.css';
import Chart from 'chart.js/auto';
import {db} from '../services/firebase';
import {DocumentSnapshot, doc, getDoc, onSnapshot } from 'firebase/firestore';
import applStockData from './DataGen'

function Graph(user) {

  //   const userRef = doc(db, "user_test", 'sLSyh9pz7JSLdTCvMK8lQEuLtjo1');
  //   const docbase=onSnapshot(userRef, (docSnapshot) => {
  //     if (docSnapshot.exists()) {
  //       console.log(docSnapshot.data().balance || 0);
  //     };
  //   }
  // );
  //   docbase;

  // const getdata = async (user) => {
  //   const userRef = doc(db, "user_test", 'sLSyh9pz7JSLdTCvMK8lQEuLtjo1');
  
  //   try {
  //     const docSnapshot = await getDoc(userRef);
  
  //     console.log(docSnapshot.balance);
  //   } catch (error) {
  //     console.error("Error checking/updating user in Firestore:", error);
  //   }
  // };
  // getdata();
    // getMyStocks();
    
    
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
        if (!containerWidth) return;

        if (chartInstance) {
            chartInstance.destroy();
        }

        const ctx = canvasRef.current.getContext('2d');
        const newChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: applStockData.date,
                datasets: [{
                    label: 'close',
                    data: applStockData.close,
                    backgroundColor: 'purple',
                    borderColor: 'rgba(50, 50, 200, 1)',
                    borderWidth: 1
                },
              {
                label:'open',
                data:applStockData.open,
                borderColor: 'rgba(50, 50, 200, 1)',
              },
              {
                label:'high',
                data:applStockData.high,
                backgroundColor: 'green',
                borderColor: 'rgba(50, 50, 200, 1)',
              },
              {
                label:'low',
                data:applStockData.low,
                backgroundColor: 'yellow',
                borderColor: 'rgba(50, 50, 200, 1)',
              },
              ]},
            options: {
                responsive: true,
                maintainAspectRatio: false,
                color:'white',
                backgroundColor:'#9BD0F5',
            }
        });
        setChartInstance(newChartInstance);
    }, [containerWidth]);

    return (
      <div className='linegraph'>
          <canvas ref={canvasRef} className='chartStyle'></canvas>
          {/* <Line data={{}} id="chart" /> */}
      </div>
  );
}

export default Graph;
