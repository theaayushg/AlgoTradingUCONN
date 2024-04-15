import React, { useState } from 'react';
import { addToPortfolio } from '../services/AddToPortfolio';  
import { sellStock } from '../services/SellStock';  
import { increaseBalance } from '../services/IncreaseBalance';

//user portfolio not loading bug
//portfolio not loading

function Invest({ user, stockData, user_portfolio, balance, setBalance }) {
  const [selectedStock, setSelectedStock] = useState('');
  const [numShares, setNumShares] = useState(0);
  const [action, setAction] = useState('buy');

  const handleActionChange = (e) => {
    setAction(e.target.value);
  };

  const handleBuyStock = async () => {
    try {
      // use stockData
      const stockObject = stockData.find(item => item.name === selectedStock);
      if(stockObject){
        const cost = stockObject.c * numShares; //.c is price
        const cur_stockData = {
          BuyPrice: stockObject.c,
          Shares: Number(numShares),
        };
        await increaseBalance(user, balance, -cost, setBalance);
        await addToPortfolio(user.uid, selectedStock, cur_stockData);
      }
      else{
        console.error(`Stock with ticker ${selectedStock} not found.`);
      }
    } catch (error) {
      console.error("Error buying stock:", error.message);
    }
  };

  const handleSellStock = async () => {
    try {
      // use user_portfolio
      const cur_stockObj = stockData.find(item => item.name === selectedStock);
      if(cur_stockObj){
        const cost = cur_stockObj.c * Number(numShares);
        await sellStock(user.uid, selectedStock, Number(numShares));
        await increaseBalance(user, balance, cost, setBalance);
      }
      else{
        console.error(`Stock with ticker ${selectedStock} not found.`);
      }
    } catch (error) {
      console.error("Error selling stock:", error.message);
    }
  };

  return (
    <div>
      <div>
        <h2>Invest</h2>
        <div>
          <label>
            <input type="radio" value="buy" checked={action === 'buy'} onChange={handleActionChange} />
            Buy
          </label>
          <label>
            <input type="radio" value="sell" checked={action === 'sell'} onChange={handleActionChange} />
            Sell
          </label>
        </div>
        {action === 'buy' && (
          <div>
            <select value={selectedStock} onChange={(e) => setSelectedStock(e.target.value)}>
              <option value="">Select a stock</option>
              {stockData.map((stock) => (
                <option key={stock.name} value={stock.name}>
                  {stock.name}
                </option>
              ))}
            </select>
            <input type="number" value={numShares} onChange={(e) => setNumShares(e.target.value)} />
            <button onClick={handleBuyStock}>Buy</button>
          </div>
        )}
        {action === 'sell' && (
          <div>
            <select value={selectedStock} onChange={(e) => setSelectedStock(e.target.value)}>
              <option value="">Select a stock</option>
              {user_portfolio.map((stock) => (
                <option key={stock.ticker} value={stock.ticker}>
                  {stock.ticker}
                </option>
              ))}
            </select>
            <input type="number" value={numShares} onChange={(e) => setNumShares(e.target.value)} />
            <button onClick={handleSellStock}>Sell</button>
          </div>
        )}
      </div>
      <div>
        <h2>Transaction History</h2>
      </div>
    </div>
  );
}

export default Invest;
