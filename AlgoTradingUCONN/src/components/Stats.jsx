import React, { useState, useEffect } from 'react';
import "../styles/Stats.css"
import axios from "axios";
import StatsRow from './StatsRow';
// import { db } from '../services/firebase';
// import { doc, getDoc } from "firebase/firestore";

const TOKEN = "cnd3ll1r01qr85dtaltgcnd3ll1r01qr85dtalu0";
const BASE_URL = "https://finnhub.io/api/v1/quote";

export const getStockData = async (stock) => {
  return axios
    .get(`${BASE_URL}?symbol=${stock}&token=${TOKEN}`)
    .catch((error) => {
      console.error("Error", error.message);
    });
};

function Stats({ user_portfolio, setSelectedStock }) {

  const [stockData, setStockData] = useState([])

  useEffect(()=>{
    const stocksList = ['AAPL', 'MSFT', 'JNJ', 'PG', 'KO', 'XOM', 'WMT', 'IBM', 'GE', 'F', 'GOOGL', 'AMZN', 'META', 'TSLA', 'NFLX', 'INTC', 'AMD', 'NVDA', 'V', 'PYPL'];
    
    let tempStockData = []
    let promises = [];
    stocksList.map((stock) => {
      promises.push(
        getStockData(stock)
        .then((res) => {
          tempStockData.push({
            name: stock,
            ...res.data
          });
        })
      )
    });

    Promise.all(promises).then(() => {
      setStockData(tempStockData);
    })

  }, []);

  return (
    <div className="stats">
      <div className="stats__container">
        <div className="stats__header">
          <p>My Stocks</p>
        </div>
        <div className="stats__content">
          <div className="stats__rows">
           {user_portfolio.map((stock) => (
            <StatsRow
              key={stock.ticker}
              name={stock.ticker}
              openPrice={stock.info.o}
              volume={stock.numShares}
              price={stock.info.c}
            />
           ))}
          </div>
        </div>
        
        <div className="stats__header stats__lists">
          <p>Listed Stocks</p>
        </div>
        <div className="stats__content" onClick={() => setSelectedStock(stock.name)}>
          <div className="stats__rows">
            {stockData.map((stock) => (
              <StatsRow
                key={stock.name}
                name={stock.name}
                openPrice={stock.o}
                price={stock.c}
                onClick={() => setSelectedStock(stock.name)} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Stats;