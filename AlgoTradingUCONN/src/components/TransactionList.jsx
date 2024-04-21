import React, { useState, useEffect } from "react";
import { getDoc, doc } from 'firebase/firestore';
import { db } from "../services/firebase";
import historyicon from "../assets/transaction-history.svg";
import TransactionRow from './TransactionRow';
import '../styles/Invest.css';

function TransactionList({ userId, reload }) {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        fetchTransactions();
    }, [userId, reload]);

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

    return (
        <div className="transactions">
            <div className="trans__container">
                {/* <div className="trans__header">
                    <p><img src={historyicon} alt="Transaction History Icon" className="history__icon" />
                        Transaction History</p>
                </div> */}
                <ol className="trans__rows">
                    {transactions.length > 0 ? (
                        transactions.map((transaction) => (
                            <TransactionRow key={transaction.id} order={transaction} />
                        ))
                    ) : (
                        <li>No transactions found.</li>
                    )}
                </ol>
            </div>
        </div>
    );
}

export default TransactionList;


