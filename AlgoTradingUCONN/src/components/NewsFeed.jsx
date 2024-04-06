import React, { useState, useEffect } from "react";
import "../styles/NewsFeed.css";
import Graph from "./Graph";
import TimeLine from "./TimeLine";


function NewsFeed({ user_portfolio }) {
  const [PortfolioData, setPortfolioData] = useState({price: 0, priceChange: 0, percentageChange: 0 });

  const calc_PPrice = () => {
    let total_worth = 0;
    let total_priceChange = 0;
    let initial_worth = 0;

    user_portfolio.forEach((stock) => {
      const curTotalPrice = stock.info.c * stock.numShares;
      const buyTotalPrice = stock.avgSharePrice * stock.numShares;

      total_worth += curTotalPrice;
      total_priceChange += curTotalPrice - buyTotalPrice;

      initial_worth += buyTotalPrice;
    });

    const percentageChange = ((total_worth - initial_worth) / initial_worth) * 100;

    return { price: total_worth.toFixed(2), priceChange: total_priceChange.toFixed(2), percentageChange: percentageChange.toFixed(2) };
  };

  useEffect(() => {
    const newPortfolioData = calc_PPrice();
    setPortfolioData(newPortfolioData);
  }, [user_portfolio]);

  return (
    <div className="newsfeed">
      <div className="newsfeed__container">
        <div className="newsfeed__chartSection">
          <div className="newsfeed__portfolio">
            <h1>${Number(PortfolioData.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h1>
            <p>{PortfolioData.priceChange > 0 ? '+' : ''}${Number(PortfolioData.priceChange).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({PortfolioData.percentageChange > 0 ? '+' : ''}{PortfolioData.percentageChange}%) All Time</p>
          </div>  
          <div className="newsfeed__chart">
            <Graph />
            <TimeLine />
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewsFeed;