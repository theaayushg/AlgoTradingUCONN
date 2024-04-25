import React, { useState } from "react";
import { addToPortfolio } from "../services/AddToPortfolio";
import { addTransaction } from "../services/AddTransaction";
import { sellStock } from "../services/SellStock";
import { increaseBalance } from "../services/IncreaseBalance";
import { Timestamp } from "firebase/firestore"
import ErrorMessage from "../services/ErrorMessage";
import TransactionList from "./TransactionList";
import "../styles/investment.css";

function Invest({ user, stockData, user_portfolio, setPortfolio, balance, setBalance }) {
  const [selectedStock, setSelectedStock] = useState("");
  const [numShares, setNumShares] = useState(0);
  const [action, setAction] = useState("buy");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [reloadTransactions, setreloadTransactions] = useState(false);
  const [view, setView] = useState("transactions");

  const handleActionChange = (e) => {
    setAction(e);
  };

  const handleReloadTransactions = () => {
    setreloadTransactions(!reloadTransactions);
  }

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
          await addTransaction(user.uid, selectedStock, cur_stockData, "BUY", Timestamp.now());
          setSuccessMessage(`Successfully bought ${numShares} shares of ${selectedStock}`);
          handleReloadTransactions();
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
          await addTransaction(user.uid, selectedStock, sold_stockData, "SELL", Timestamp.now());
          setSuccessMessage(`Successfully Sold ${numShares} shares of ${selectedStock}`);
          handleReloadTransactions();
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

  const handleViewChange = (action) => {
    setAction(action);
    setView("invest");
  };

  const toggleView = (view) => {
    setView(view);
  };

  return (
    <div className="investment-app">
      <div className="invest-invest-container">
      <div className="investment-container">
        <div className="investment-header investment-lists">
          <p>Invest</p>
        </div>
        <div className="action-buttons">
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
          <div className="investment-form">
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
              placeholder="Number of shares"
            />
            <button onClick={handleBuyStock}>Enter</button>
          </div>
        )}
        {action === "sell" && (
          <div className="investment-form">
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
            placeholder="Number of shares"
          />
          <button onClick={handleSellStock}>Enter</button>
          </div>
        )}
        <div className="error-message">
          {successMessage && (
            <ErrorMessage message={successMessage} onClose={() => setSuccessMessage(null)} />
          )}
          {errorMessage && (
            <ErrorMessage message={errorMessage} onClose={() => setErrorMessage(null)} />
          )}
        </div>
      </div>
      </div>

      <div className="view-buttons">
              <button onClick={() => toggleView("transactions")} className={view === "transactions" ? "active" : ""}>Transaction History</button>
              <button onClick={() => toggleView("performance")} className={view === "performance" ? "active" : ""}>Performance</button>
      </div>
      
      {view === "transactions" && (
        <div className="invest-invest-container">
        <div className="investment-container">
          <div className="investment-header investment-lists">
            <p>Transaction History</p>
          </div>
          <TransactionList userId={user.uid} reload={view === "transactions"}/>
        </div>
        </div>
      )}
      
      {view === "performance" && (
        <div className="investment-container">
          <div className="investment-header investment-lists">
            <p>Performance</p>
          </div>
          <div className="performance-content">
            {/* Empty container for now */}
          </div>
        </div>
      )}
    </div>
  );
}

export default Invest;
