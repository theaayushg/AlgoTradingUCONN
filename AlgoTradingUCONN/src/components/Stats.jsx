import React, { useState, useEffect } from 'react';
import "../styles/Stats.css"
import axios from "axios";
import StatsRow from './StatsRow';
import { db } from '../services/firebase';
import { collection, doc, getDoc } from "firebase/firestore";

const TOKEN = "cnd3ll1r01qr85dtaltgcnd3ll1r01qr85dtalu0";
const BASE_URL = "https://finnhub.io/api/v1/quote";

function Stats(userid) {

  const [stockData, setStockData] = useState([])
  const [myStocks, setMyStocks] = useState([])

  const getMyStocks = async (userId) => {
    let promises = [];
    let tempData = [];

    const userIdString = userId.userid
    //console.log(userIdString);
    const userRef = doc(db,'user_test', userIdString);
    const userDoc = await getDoc(userRef);
    //console.log(userDoc.data().Portfolio);
    
    if(userDoc && userDoc.data().Portfolio){
      const portfolio = userDoc.data().Portfolio;
      Object.keys(portfolio).forEach(ticker => {
        const cur_stockData = portfolio[ticker];
        promises.push(
          getStockData(ticker)
            .then(res => {
              tempData.push({
                ticker: ticker,
                avgSharePrice: cur_stockData.BuyPrice,
                numShares: cur_stockData.Shares,
                info: res.data,
              });
            })
            .catch(error => {
              console.error(`Error fetching stock data for ${ticker}:`, error);
            })
        );
      });

      Promise.all(promises)
        .then(() => {
          //console.log(tempData);
          setMyStocks(tempData);
          //console.log(myStocks);
        })
        .catch(error => {
          console.error('Error fetching stock data:', error);
        });
    }
  };


  const getStockData = async (stock) => {
    return axios
      .get(`${BASE_URL}?symbol=${stock}&token=${TOKEN}`)
      .catch((error) => {
        console.error("Error", error.message);
      });
  };

  useEffect(()=>{
    const stocksList = ['AAPL', 'MSFT', 'JNJ', 'PG', 'KO', 'XOM', 'WMT', 'IBM', 'GE', 'F', 'GOOGL', 'AMZN', 'META', 'TSLA', 'NFLX', 'INTC', 'AMD', 'NVDA', 'V', 'PYPL'];

    getMyStocks(userid); 
    
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
           {myStocks.map((stock) => (
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
        <div className="stats__content">
          <div className="stats__rows">
            {stockData.map((stock) => (
              <StatsRow
                key={stock.name}
                name={stock.name}
                openPrice={stock.o}
                price={stock.c}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Stats;