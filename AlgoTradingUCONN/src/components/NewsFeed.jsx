import React, { useState, useEffect } from "react";
import "../styles/NewsFeed.css";
import Graph from "./Graph";
import TimeLine from "./TimeLine";
import StockGraphs from "./StockGraphs";
import News from "./News.jsx";
import PerformanceChart from "./PerfChart";

function GraphOrStock({ selectStock, user_portfolio, PortfolioData ,stockData, predictDisplay, portfolioStock, view, userid}) {
  if (selectStock == "portfolio" && view === false) {
    return <Graph user_portfolio={user_portfolio} PortfolioData={PortfolioData} portfolioStock={portfolioStock}/>;
  } else if (selectStock == "portfolio" && view === true) {
    return <PerformanceChart userId={userid} />;
  }
  else {
    return <StockGraphs selectStock={selectStock} stockData={stockData} predictDisplay={predictDisplay}/>;
  }
}

function NewsFeed({ user_portfolio, selectStock, stockData, portfolioStock, userid}) {
  const [PortfolioData, setPortfolioData] = useState({price: 0, priceChange: 0, percentageChange: 0 });
  const [predictDisplay,setPredictDisplay]=useState(false);
  const [viewPerformance ,setviewPerformance]=useState(false);

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
          <div className="newsfeed__chart">
            <GraphOrStock user_portfolio={user_portfolio} selectStock={selectStock} PortfolioData={PortfolioData} stockData={stockData} predictDisplay={predictDisplay} portfolioStock={portfolioStock} view={viewPerformance} userid={userid}/>
            <TimeLine setPredictDisplay={setPredictDisplay} selectStock={selectStock} viewPerformance={viewPerformance} setviewPerformance={setviewPerformance} />
            <News selectStock={selectStock} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewsFeed;
