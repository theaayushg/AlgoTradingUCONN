import React, { useState, useEffect } from 'react';
import Logout from './Logout';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

function Account({ userid }) 
{
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => 
  {
    const fetchUserData = async () => 
    {
      const userRef = doc(db, "user_test", userid);
      try 
      {
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) 
        {
          const userData = docSnap.data();
          setAddress(userData.address || '');
          setPhoneNumber(userData.phone_number || ''); 
        }
      } 
      catch (error) 
      {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userid]);

  const handleChangeAddress = async () => 
  {
    const userRef = doc(db, "user_test", userid);

    try 
    {
      await updateDoc(userRef, {address: address});
    } 
    catch (error) 
    {
      console.error("Error updating address:", error);
    }
  }

  const handleChangePhoneNumber = async () => 
  {
    const userRef = doc(db, "user_test", userid);

    try 
    {
      await updateDoc(userRef, {phone_number: phoneNumber});
    } 
    catch (error) 
    {
      console.error("Error updating phone number:", error);
    }
  }

  return (
    <div>
      <div className='app__container'>
        <input type="text" placeholder="Enter New Address" value={address} onChange={(e) => setAddress(e.target.value)} />
        <button onClick={handleChangeAddress}>Change Address</button>
      </div>

      <div className='app__container'>
        <input type="text" placeholder="Enter New Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        <button onClick={handleChangePhoneNumber}>Change Phone Number</button>
      </div>

      <div className='app__container'>
        <Logout />
      </div>
    </div>
  );
}

export default Account;

// import React, { useState } from 'react';
// import Logout from './Logout';
// import { doc, updateDoc } from 'firebase/firestore';
// import { db } from '../services/firebase';
// import '../styles/Account.css';

// function Account({ userid }) 
// {
//   const [address, setAddress] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');

//   const handleChangeAddress = async () => 
//   {
//     const userRef = doc(db, "user_test", userid);

//     try {
//       await updateDoc(userRef, {
//         address: address // Update the address field with the new value
//       });
//       setAddress(''); // Clear the input field after successful update
//     } catch (error) {
//       console.error("Error updating address:", error);
//     }
//   }

//   const handleChangePhoneNumber = async () => 
//   {
//     const userRef = doc(db, "user_test", userid);

//     try {
//       await updateDoc(userRef, {
//         phone_number: phoneNumber // Update the phone_number field with the new value
//       });
//       setPhoneNumber(''); // Clear the input field after successful update
//     } catch (error) {
//       console.error("Error updating phone number:", error);
//     }
//   }

//   return (
//     <div className='Account__main'>
//       <div>
//         <input type="text" placeholder="Enter New Address" value={address} onChange={(e) => setAddress(e.target.value)} />
//         <button onClick={handleChangeAddress}>Change Address</button>
//       </div>

//       <div>
//         <input type="text" placeholder="Enter New Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
//         <button onClick={handleChangePhoneNumber}>Change Phone Number</button>
//       </div>

//       <div className="logout__container">
//         <Logout />
//       </div>
//     </div>
//   );
// }

// export default Account;

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