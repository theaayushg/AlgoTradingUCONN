import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';

function Graph({ user }) {
  const [chartInstance, setChartInstance] = useState(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [Balance,setbalance]=useState(0);
  const [depositWithdrawal, setDepositWithdrawal] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (user) {
      const userRef = doc(db, "user_test", user.uid);
      const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const currentbalance=docSnapshot.data().balance || 0;
          // const depWithArray = data["Deposit/Withdrawal History"] || [];
          // setDepositWithdrawal(depWithArray);
          setbalance(currentbalance);
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
    if (!containerWidth || !depositWithdrawal) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    Chart.register(...registerables);

    // const data = depositWithdrawal.map(transaction => ({
    //   date: new Date(transaction.Date),
    //   amount: transaction.Amount
    // }));

    // const sortedData = data.sort((a, b) => a.date - b.date);

    const ctx = canvasRef.current.getContext('2d');
    const newChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: balance,
        datasets: [{
          label: 'Value',
          data: balance,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderWidth: 1,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Amount'
            },
            beginAtZero: true
          }
        }
      }
    });

    setChartInstance(newChartInstance);
  }, [containerWidth]);

  return (
    <div className='linegraph'>
      <p>Balance: {Balance}</p> 
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}

export default Graph;
