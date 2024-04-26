import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './services/firebase';

const useStockPrices = () => {
  const [prices, setPrices] = useState({});

  useEffect(() => {
    const fetchStockPrices = async () => {
      const stockDataRef = doc(db, 'StockData', 'Data');
      try {
        const stockDataSnap = await getDoc(stockDataRef);
        if (stockDataSnap.exists()) {
          const stocks = stockDataSnap.data().Stocks;
          const stockPrices = {};

          Object.keys(stocks).forEach(ticker => {
            stockPrices[ticker] = stocks[ticker].c; // 'c' is the closing price
          });

          setPrices(stockPrices);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error getting document:', error);
      }
    };

    fetchStockPrices();
  }, []);

  return prices;
};

export default useStockPrices;
