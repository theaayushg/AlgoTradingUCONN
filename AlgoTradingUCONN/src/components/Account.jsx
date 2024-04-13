import React from 'react';
import { addToPortfolio } from '../services/AddToPortfolio'; 
import { sellStock } from '../services/SellStock';

function Account({ userid }) {
  const stockTicker = "JNJ";
  const stockData = {
    BuyPrice: 150.00,
    Shares: 10,
  };

  const handleBuyStockClick = async () => {
    try{
      await addToPortfolio(userid, stockTicker, stockData);
    }
    catch(error){
      console.error("error adding to portfolio, line 17: ", error.message);
    }
  };

  const handleRemoveStockClick = async () => {
    try{
      await sellStock(userid, stockTicker, 10);
    }
    catch(error){
      console.error("error removing from portfolio, line 26: ", error.message);
    }
  }

  return (
    <div>
      <div>Account Page Content</div>
      <div>
        <a href="#" onClick={handleBuyStockClick}>buy a stock</a>
      </div>
      <div>
        <a href="#" onClick={handleRemoveStockClick}>sell a stock</a>
      </div>
    </div>
  );
}

export default Account;