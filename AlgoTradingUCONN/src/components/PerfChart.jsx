import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { getDoc, doc } from 'firebase/firestore';
import { db } from "../services/firebase";

function PerformanceChart({ userId }) {
    const [chartData, setChartData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const transactions = await fetchTransactions();
            const dataByDate = processData(transactions);
            const chartData = prepareChartData(dataByDate);
            setChartData(chartData);
        };

        fetchData();
    }, [userId]); 

    const fetchTransactions = async () => {
        if (!userId) {
            console.log("No user ID provided");
            return [];
        }

        const userDocRef = doc(db, "user_test", userId);
        try {
            const docSnap = await getDoc(userDocRef);
            if (!docSnap.exists()) {
                console.log(`No document found for user ${userId}`);
                return [];
            }

            const orders = docSnap.data().Orders;
            if (!orders) {
                console.log(`No transactions found for user ${userId}`);
                return [];
            }

            return Object.entries(orders).map(([id, order]) => ({
                id,
                orderType: order[0], // "BUY" or "SELL"
                stockTicker: order[1], // "IBM", etc.
                stockData: order[2], // Includes BuyPrice, Shares, etc.
                timeStamp: order[3] ? order[3].toDate() : new Date()
            })).sort((a, b) => a.timeStamp - b.timeStamp); // Sort transactions by date ascending
        } catch (error) {
            console.error("Error fetching transactions:", error);
            return [];
        }
    };

    const processData = (transactions) => {
        let dailyValues = {};
        let portfolio = {};

        transactions.forEach(transaction => {
            const { stockTicker, stockData, orderType, timeStamp } = transaction;
            const dateKey = timeStamp.toISOString().split('T')[0]; // Convert timestamp to YYYY-MM-DD format

            if (!dailyValues[dateKey]) {
                dailyValues[dateKey] = {
                    value: 0,
                    previousValue: Object.keys(dailyValues).length > 0 ? dailyValues[Object.keys(dailyValues).at(-1)].value : 0
                };
            }

            if (orderType === "BUY") {
                portfolio[stockTicker] = (portfolio[stockTicker] || 0) + stockData.Shares;
            } else if (orderType === "SELL") {
                portfolio[stockTicker] = (portfolio[stockTicker] || 0) - stockData.Shares;
            }

            // Simulate a method to get the closing price for the stock on that day
            const stockDocRef = doc(db, "StockData", "Data");
            let closingPrice = stockData.BuyPrice; // Placeholder for actual logic to fetch daily closing prices

            dailyValues[dateKey].value += portfolio[stockTicker] * closingPrice; // Update daily total value
        });

        return dailyValues;
    };

    const prepareChartData = (dataByDate) => {
        const labels = Object.keys(dataByDate);
        const data = labels.map(date => {
            const { value, previousValue } = dataByDate[date];
            return ((value - previousValue) / previousValue) * 100; // Percentage change formula
        });

        return {
            labels,
            datasets: [{
                label: 'Daily Percentage Change',
                data,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        };
    };

    return (
        <div>
            {Object.keys(chartData).length > 0 ? <Line data={chartData} /> : <p>Loading chart...</p>}
        </div>
    );
}

export default PerformanceChart;
