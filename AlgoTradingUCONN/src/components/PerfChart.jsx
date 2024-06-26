import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { getDoc, doc } from 'firebase/firestore';
import { db } from "../services/firebase";
import { data } from '@tensorflow/tfjs';


function PerformanceChart({ userId, user_portfolio }) {
    const [chartData, setChartData] = useState({});
    const [todayData, setTodayData] = useState({value: 0, presentDayValue: 0});
    const [todayPercent, setTodayPercent] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const transactions = await fetchTransactions();
            const stockPrices = await fetchStockPrices();
            const dataByDate = processData(transactions, stockPrices);
            const dateKey = Object.keys(dataByDate).reduce((a, b) => dataByDate[a] > dataByDate[b] ? a : b);
            setTodayData(dataByDate[dateKey]);
            const chartData = prepareChartData(dataByDate);
            setChartData(chartData);
        };

        fetchData();
    }, [userId, user_portfolio]);

    const fetchStockPrices = async () => {
        const stockDataRef = doc(db, 'StockData', 'Data');
        const stockDataSnap = await getDoc(stockDataRef);
        if (stockDataSnap.exists()) {
            const stocks = stockDataSnap.data().Stocks;
            const stockPrices = {};
            Object.keys(stocks).forEach(ticker => {
                stockPrices[ticker] = stocks[ticker].c;
            });
            return stockPrices;
        } else {
            console.log('No stock data available');
            return {};
        }
    };

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

    const processData = (transactions, stockPrices) => {
        let dailyValues = {};
        let portfolio = {};
        let totalWorth = 0;
        let cur_totalWorth = 0;
    
        transactions.forEach(transaction => {
            const { stockTicker, stockData, orderType, timeStamp } = transaction;
            const dateKey = timeStamp.toISOString().split('T')[0];
    
            if (!dailyValues[dateKey]) {
                dailyValues[dateKey] = { value: 0, presentDayValue: 0 };
            }
    
            const sharesChange = orderType === "BUY" ? stockData.Shares : -stockData.Shares;
            portfolio[stockTicker] = (portfolio[stockTicker] || 0) + sharesChange;
    
            totalWorth += sharesChange * (orderType === "BUY" ? stockData.BuyPrice : stockData.SellPrice);
            dailyValues[dateKey].value = totalWorth;
            cur_totalWorth += sharesChange * stockPrices[stockTicker];
            dailyValues[dateKey].presentDayValue = cur_totalWorth
        });
    
        return dailyValues;
    };

    const prepareChartData = (dataByDate) => {
        const labels = Object.keys(dataByDate);
        const data = labels.map(date => {
            const { value, presentDayValue } = dataByDate[date];
            let value_log = (presentDayValue - value);
            console.log(value_log);
            return (presentDayValue - value); // Percentage change formula
        });

        return {
            labels,
            datasets: [{
                label: 'Portfolio value ($)',
                data,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        };
    };

    return (
        <div>
            <div className="newsfeed__portfolio">
                <h1>Portfolio Performance</h1>
                <h3>Current Gain: ${(todayData.presentDayValue - todayData.value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            </div>
            {Object.keys(chartData).length > 0 ? <Line data={chartData} /> : <p>Loading chart...</p>}
        </div>
    );
}

export default PerformanceChart;
