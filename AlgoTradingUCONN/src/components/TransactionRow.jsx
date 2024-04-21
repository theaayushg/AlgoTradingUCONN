// OrderRow.jsx
import React from 'react';
import '../styles/Invest.css'; 

const TransactionRow = ({ order }) => {
    const { stockTicker, orderType, stockData, timeStamp } = order;
    const { BuyPrice, SellPrice, Shares } = stockData;

    return (
        <div className="orderrow">
            <div className="orderrow__intro">
                <h1>{stockTicker}</h1>
                <p>{orderType} Order</p>
            </div>
            <div className="orderrow__numbers">
                <p>Shares: {Shares}</p>
                <p className="orderrow__price">Price: ${orderType === 'BUY' ? BuyPrice : SellPrice}</p>
                <p>Date: {timeStamp.toLocaleDateString()}</p> {/* Ensure timestamp is a Date object */}
            </div>
        </div>
    );
};

export default TransactionRow;
