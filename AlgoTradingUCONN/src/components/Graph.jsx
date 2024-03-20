import React, { useEffect, useRef, useState } from 'react';
import './Graph.css';
import { Chart, registerables } from 'chart.js';
import { db } from '../services/firebase'; 
import { doc, onSnapshot } from 'firebase/firestore'; 
import applStockData from './DataGen'; 

function Graph({ user }) { 
    const [chartInstance, setChartInstance] = useState(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const [balance, setBalance] = useState(0);
    const canvasRef = useRef(null);

    useEffect(() => {
        if (user) {
            const userRef = doc(db, "portfolios", user.uid);
            const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();
                    const currentBalance = data["Current Cash Balance"] || 0;
                    setBalance(currentBalance);
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
        if (!containerWidth) return;

        if (chartInstance) {
            chartInstance.destroy();
        }

        Chart.register(...registerables); // Register necessary components

        const ctx = canvasRef.current.getContext('2d');
        const newChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: applStockData.date,
                datasets: [{
                    label: 'Close',
                    data: applStockData.close,
                    backgroundColor: 'purple',
                    borderColor: 'rgba(50, 50, 200, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Open',
                    data: applStockData.open,
                    borderColor: 'rgba(50, 50, 200, 1)',
                },
                {
                    label: 'High',
                    data: applStockData.high,
                    backgroundColor: 'green',
                    borderColor: 'rgba(50, 50, 200, 1)',
                },
                {
                    label: 'Low',
                    data: applStockData.low,
                    backgroundColor: 'yellow',
                    borderColor: 'rgba(50, 50, 200, 1)',
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                color: 'white',
                backgroundColor: '#9BD0F5',
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Date'
                        },
                        type: 'time', // Set x-axis scale type to time
                        time: {
                            unit: 'day' // Define time unit
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Value'
                        }
                    }
                }
            }
        });

        setChartInstance(newChartInstance);
    }, [containerWidth]);

    return (
        <div className='linegraph'>
            <p>Balance: {balance}</p> {/* Display the balance */}
            <canvas ref={canvasRef} className='chartStyle'></canvas>
        </div>
    );
}

export default Graph;
