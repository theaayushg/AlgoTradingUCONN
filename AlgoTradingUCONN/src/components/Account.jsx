import React, { useState } from 'react';
import Logout from './Logout';

function Account({ userid }) 
{
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleChangePassword = async () => 
  {
    // TODO
  }

  const handleChangeAddress = async () => 
  {
    // TODO
  }

  const handleChangePhoneNumber = async () => 
  {
    // TODO
  }

  return (
    <div>
      <div>Account Page Content</div>

      <div>
        <input type="password" placeholder="Enter Current Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input type="password" placeholder="Enter New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        <button onClick={handleChangePassword}>Change Password</button>
      </div>

      <div>
        <input type="text" placeholder="Enter New Address" value={address} onChange={(e) => setAddress(e.target.value)} />
        <button onClick={handleChangeAddress}>Change Address</button>
      </div>

      <div>
        <input type="text" placeholder="Enter New Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        <button onClick={handleChangePhoneNumber}>Change Phone Number</button>
      </div>

      <div>
        <Logout />
      </div>
    </div>
  );
}

export default Account;

// import React from 'react';
// import { addToPortfolio } from '../services/AddToPortfolio'; 
// import { sellStock } from '../services/SellStock';
// import Logout from './Logout';

// function Account({ userid }) {
//   const stockTicker = "JNJ";
//   const stockData = {
//     BuyPrice: 150.00,
//     Shares: 10,
//   };

//   const handleBuyStockClick = async () => {
//     try{
//       await addToPortfolio(userid, stockTicker, stockData);
//     }
//     catch(error){
//       console.error("error adding to portfolio, line 17: ", error.message);
//     }
//   };

//   const handleRemoveStockClick = async () => {
//     try{
//       await sellStock(userid, stockTicker, 10);
//     }
//     catch(error){
//       console.error("error removing from portfolio, line 26: ", error.message);
//     }
//   }

//   return (
//     <div>
//       <div>Account Page Content</div>
//       <div>
//         <a href="#" onClick={handleBuyStockClick}>buy a stock</a>
//       </div>

//       <div>
//         <a href="#" onClick={handleRemoveStockClick}>sell a stock</a>
//       </div>

//       <div>
//         <Logout />
//       </div>
//     </div>
//   );
// }

// export default Account;