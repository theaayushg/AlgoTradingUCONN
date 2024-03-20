import React, { useState } from "react";
import { increaseBalance } from "../services/IncreaseBalance";

function AddFunds({ user, balance, setBalance }) {
  //const [currentBalance, setCurrentBalance] = useState(0);

  const handleAddFunds = () => {
    increaseBalance(user, balance, 10, setBalance);
  }

  return (
  <div>
      <div>Add Funds Page Content</div>
      <div> 
        <a href="#" onClick={handleAddFunds}>Add $10</a> 
      </div>

  </div>
  );
}

export default AddFunds;