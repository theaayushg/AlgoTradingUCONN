import React, { useState, useEffect } from "react";
import { getDoc, doc } from 'firebase/firestore';
import { db } from "../services/firebase";
import '../styles/Invest.css';
import historyicon from "../assets/transaction-history.svg";
import OrderRow from './OrderRow';


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
                        stockData: order[2], // Includes BuyPrice, Shares, etc.
                        timeStamp: order[3].timeStamp ? order[3].timeStamp.toDate() : new Date()
                    })).sort((a, b) => b.timeStamp - a.timeStamp);

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
        <div className="transactions">
        <div className="trans__container">
            <div className="trans__header">
                <p><img src={historyicon} alt="Transaction History Icon" className="history__icon" />
                Transaction History</p>
            </div>
            <ul className="trans__rows">
            {transactions.length > 0 ? (
                transactions.map((transaction) => (
                    <OrderRow key={transaction.id} order={transaction} />
                ))
            ) : (
                <li>No transactions found.</li>
            )}
            </ul>
        </div>
    </div>
    );
  };
  