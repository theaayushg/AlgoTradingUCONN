import React from "react";
import "../styles/NewsFeed.css";
import Graph from "./Graph";
import TimeLine from "./TimeLine";

function NewsFeed() {
  return (
    <div className="newsfeed">
      <div className="newsfeed__container">
        <div className="newsfeed__chartSection">
          <div className="newsfeed__portfolio">
            <h1>$5,394.44</h1>
            <p>+$44.63 (0.04%) Today</p>
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