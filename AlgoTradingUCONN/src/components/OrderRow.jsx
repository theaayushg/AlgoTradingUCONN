// OrderRow.jsx
import React from 'react';
import '../styles/Invest.css'; 
// import '../styles/StatsRow.css'

const OrderRow = ({ order }) => {
    const { stockTicker, orderType, stockData, timeStamp } = order;
    const { BuyPrice, SellPrice, Shares } = stockData;

    return (
        <div className="row">
            <div className="row__intro">
                <h1>{stockTicker}</h1>
                <p>{orderType} Order</p>
            </div>
            <div className="row__numbers">
                <p className="row__price">Price: ${orderType === 'BUY' ? BuyPrice : SellPrice}</p>
                <p>Shares: {Shares}</p>
                <p>Date: {timeStamp.toLocaleDateString()}</p> {/* Ensure timestamp is a Date object */}
            </div>
        </div>
    );
};

export default OrderRow;
