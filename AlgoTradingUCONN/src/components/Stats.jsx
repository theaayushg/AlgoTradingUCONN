import React, { useState, useEffect } from 'react';
import "../styles/Stats.css"
import axios from "axios";
import StatsRow from './StatsRow';
import { db } from '../services/firebase';

const TOKEN = "cnd3ll1r01qr85dtaltgcnd3ll1r01qr85dtalu0";
const BASE_URL = "https://finnhub.io/api/v1/quote";

function Stats() {

  const [stockData, setStockData] = useState([])
  const [myStocks, setmyStocks] = useState([])

  const getMyStocks = () => {
    db
    .collection('user_test')
    .onSnapshot(snapshot => {
      let promises = [];
      let tempData = [];
      snapshot.docs.map((doc) => {
        console.log(doc.data());
        //promises.push(getStockData(doc.data().))

      })
    })

  }


  const getStockData = (stock) => {
    return axios
      .get(`${BASE_URL}?symbol=${stock}&token=${TOKEN}`)
      .catch((error) => {
        console.error("Error", error.message);
      });
  };

  useEffect(()=>{
    let tempStockData = []
    // in future connect this with the list of stocks user owns from portfolio
    const stocksList = ["AAPL", "MSFT", "TSLA", "SBUX"];
    //const stocksList = ['AAPL', 'MSFT', 'JNJ', 'PG', 'KO', 'XOM', 'WMT', 'IBM', 'GE', 'F', 'GOOGL', 'AMZN', 'META', 'TSLA', 'NFLX', 'INTC', 'AMD', 'NVDA', 'V', 'PYPL'];
    let promises = [];
    //getMyStocks(); //testing purposes
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

  }, [])

  return (
    <div className="stats">
      <div className="stats__container">
        <div className="stats__header">
          <p>Stocks</p>
        </div>
        <div className="stats__content">
          <div className="stats__rows">
           
          </div>
        </div>
        <div className="stats__header">
          <p>Lists</p>
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