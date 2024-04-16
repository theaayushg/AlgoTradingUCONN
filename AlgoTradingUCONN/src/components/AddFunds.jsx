import React, { useState } from "react";
import { increaseBalance } from "../services/IncreaseBalance";

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
    <div>
      <div className='app__container'>
        <input type="number" value={amount} onChange={handleAmountChange} />
        <button onClick={handleDeposit}>Deposit</button>
        <button onClick={handleWithdraw}>Withdraw</button>
      </div>
      
      <div className='app__container'>
        {error && <div>{error}</div>}
      </div>
    </div>
  );
}

export default AddFunds;
