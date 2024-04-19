import React, { useState } from "react";
import { addToPortfolio } from "../services/AddToPortfolio";
import { addTransaction } from "../services/AddTransaction";
import { sellStock } from "../services/SellStock";
import { increaseBalance } from "../services/IncreaseBalance";
import { TransactionList } from "./Orders";
import ErrorMessage from "../services/ErrorMessage";
import "../styles/Invest.css"

//user portfolio not loading bug
//portfolio not loading

function Invest({ user, stockData, user_portfolio, setPortfolio, balance, setBalance }) {
  const [selectedStock, setSelectedStock] = useState("");
  const [numShares, setNumShares] = useState(0);
  const [action, setAction] = useState("buy");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleActionChange = (e) => {
    //setAction(e.target.value);
    setAction(e);
  };

  const handleBuyStock = async () => {
    if(numShares > 0){
      try {
        // use stockData
        const stockObject = stockData.find((item) => item.name === selectedStock);
        if (stockObject) {
          const cost = stockObject.c * numShares; //.c is price
          const cur_stockData = {
            BuyPrice: stockObject.c,
            Shares: Number(numShares),
          };
          await increaseBalance(user, balance, -cost, setBalance);
          await addToPortfolio(user.uid, selectedStock, cur_stockData, user_portfolio, setPortfolio);
          await addTransaction(user.uid, selectedStock, cur_stockData, "BUY");
          setSuccessMessage(`Successfully bought ${numShares} shares of ${selectedStock}`);
        } else {
          console.error(`Stock with ticker ${selectedStock} not found.`);
        }
      } catch (error) {
        console.error("Error buying stock:", error.message);
        setErrorMessage(error.message);
      }
    }
    else{
      setErrorMessage("Please enter a valid number of shares to buy");
    }
  };

  const handleSellStock = async () => {
    if(numShares > 0){
      try {
        // use user_portfolio
        const cur_stockObj = stockData.find(
          (item) => item.name === selectedStock,
        );
        const sold_stockData = {
          SellPrice: cur_stockObj.c,
          Shares: Number(numShares),
        };
        if (cur_stockObj) {
          const cost = cur_stockObj.c * Number(numShares);
          await sellStock(user.uid, selectedStock, Number(numShares), user_portfolio, setPortfolio);
          await increaseBalance(user, balance, cost, setBalance);
          await addTransaction(user.uid, selectedStock, sold_stockData, "SELL");
          setSuccessMessage(`Successfully Sold ${numShares} shares of ${selectedStock}`);
        } else {
          console.error(`Stock with ticker ${selectedStock} not found.`);
        }
      } catch (error) {
        console.error("Error selling stock:", error.message);
        setErrorMessage(error.message);
      }
    }
    else{
      setErrorMessage("Please enter a valid number of shares to sell");
    }
  };

  return (
<div>
  <div className="invest__page">
    <h2>Invest</h2>
    <div className="app__container">
      <button
        onClick={() => handleActionChange("buy")}
        className={action === "buy" ? "active" : ""}
      >
        Buy
      </button>
      <button
        onClick={() => handleActionChange("sell")}
        className={action === "sell" ? "active" : ""}
      >
        Sell
      </button>
    </div>
    {action === "buy" && (
      <div className="app__container">
        <select
          value={selectedStock}
          onChange={(e) => setSelectedStock(e.target.value)}
        >
          <option value="">Select a stock</option>
          {stockData.map((stock) => (
            <option key={stock.name} value={stock.name}>
              {stock.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={numShares}
          onChange={(e) => setNumShares(e.target.value)}
        />
        <button onClick={handleBuyStock}>Buy</button>
      </div>
    )}
    {action === "sell" && (
      <div className="app__container">
        <select
          value={selectedStock}
          onChange={(e) => setSelectedStock(e.target.value)}
        >
          <option value="">Select a stock</option>
          {user_portfolio.map((stock) => (
            <option key={stock.ticker} value={stock.ticker}>
              {stock.ticker}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={numShares}
          onChange={(e) => setNumShares(e.target.value)}
        />
        <button onClick={handleSellStock}>Sell</button>
      </div>
    )}
  </div>
  <div className="error_message">
    {successMessage && (
      <ErrorMessage message={successMessage} onClose={() => setSuccessMessage(null)} />
    )}
    {errorMessage && (
      <ErrorMessage message={errorMessage} onClose={() => setErrorMessage(null)} />
    )}
  </div>
  <div>
    <TransactionList userId={user.uid}/>
  </div>
</div>

  );
}

export default Invest;
