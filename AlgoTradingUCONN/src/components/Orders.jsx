import React, { useState, useEffect } from "react";
import { getDoc, doc } from 'firebase/firestore';
import { db } from "../services/firebase";
import '../styles/Invest.css';


const useFetchTransactions = (userId) => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            if (!userId) {
                console.log("No user ID provided");
                return;
            }

            const userDocRef = doc(db, "user_test", userId);
            try {
                const docSnap = await getDoc(userDocRef);
                if (!docSnap.exists()) {
                    console.log(`No document found for user ${userId}`);
                    return;
                }

                const orders = docSnap.data().Orders;
                if (!orders) {
                    console.log(`No transactions found for user ${userId}`);
                } else {
                    // Transform the orders into an array of transaction objects
                    const loadedTransactions = Object.entries(orders).map(([id, order]) => ({
                        id,
                        orderType: order[0], // "BUY" or "SELL"
                        stockTicker: order[1], // "IBM", etc.
                        stockData: order[2], // { BuyPrice, Shares, etc. }
                    }));
                    setTransactions(loadedTransactions);
                    console.log("Fetched Transactions:", loadedTransactions);
                }
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        };

        fetchTransactions();
    }, [userId]);

    return transactions;
};

export default useFetchTransactions;

export const TransactionList = ({ userId }) => {
    const transactions = useFetchTransactions(userId);
  
    return (
      <div className="trans__page">
        <h2>Transaction History</h2>
<<<<<<< HEAD
        <ul className="transaction__list">
=======
        <ul className="transaction-list">
>>>>>>> b685a526eef86455b75c8aa78e2452b6ea91c29f
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <li key={transaction.id} 
              className={`transaction-box ${transaction.orderType === 'BUY' ? 'transaction-buy' : 'transaction-sell'}`}>
                <strong>{transaction.stockTicker}</strong> -{" "}
                {transaction.orderType} at ${transaction.orderType === 'BUY' ? transaction.stockData.BuyPrice : transaction.stockData.SellPrice}{" "}
                for{' '} {transaction.stockData.Shares} shares
              </li>
            ))
          ) : (
            <li>No transactions found.</li>
          )}
        </ul>
      </div>
    );
  };
  