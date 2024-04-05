import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

const getPortfolioData = (userId) => {
  const [portfolioData, setPortfolioData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        const userRef = doc(db, 'user_test', userId.userid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists && userDoc.data().Portfolio) {
          const portfolio = userDoc.data().Portfolio;
          const portfolioData = Object.keys(portfolio).map(ticker => ({
            ticker: ticker,
            value: parseFloat(portfolio[ticker].BuyPrice) * parseInt(portfolio[ticker].Shares)
          }));
          setPortfolioData(portfolioData);
        }
      }
    };

    fetchData();

  }, [userId]);

  return portfolioData;
};

export default getPortfolioData;
