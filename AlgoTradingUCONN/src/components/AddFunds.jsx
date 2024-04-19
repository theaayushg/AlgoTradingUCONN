import React, { useState } from "react";
import { increaseBalance } from "../services/IncreaseBalance";
import "../styles/addFunds.css";

function AddFunds({ user, balance, setBalance }) {
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState(null);

  const handleAmountChange = (event) => {
    setAmount(parseFloat(event.target.value));
  };

  const handleDeposit = async () => {
    try {
      await increaseBalance(user, balance, amount, setBalance);
      setError(null);
    } catch (error) {
      setError("Error: " + error.message);
    }
  };

  const handleWithdraw = async () => {
    try {
      await increaseBalance(user, balance, -amount, setBalance);
      setError(null);
    } catch (error) {
      setError("Error: " + error.message);
    }
  };

  return (
    <div className='addfunds__container'>
        <div className="stats__header stats__lists"><p>Balance</p></div>
      <div className='error-message'>{error && <span>{error}</span>}</div>
      <div className='addfunds-input-container'>
        <input type="number" value={amount} onChange={handleAmountChange} placeholder="Enter amount" />
        <button className="deposit-button" onClick={handleDeposit}>Deposit</button>
        <button className="withdraw-button" onClick={handleWithdraw}>Withdraw</button>
      </div>
    </div>
  );
}

export default AddFunds;
