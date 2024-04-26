import React from 'react'
import '../styles/TimeLine.css'

function TimeLine({ setPredictDisplay, setviewPerformance, viewPerformance, selectStock }) {

  return (
    <div className="timelinecontainer">
      <StockOrPortfolio setPredictDisplay={setPredictDisplay} setviewPerformance={setviewPerformance} viewPerformance={viewPerformance} selectStock={selectStock} />
    </div>
  )
}

function StockOrPortfolio({ setPredictDisplay, setviewPerformance, viewPerformance, selectStock }) {
  if (selectStock === "portfolio") {
    return <button onClick={() => setviewPerformance(!viewPerformance)}>Show/Hide Performance</button>
  }
  else {
    return (
      <div className="timelinebuttons__container">
        <button className="Show_Predict" onClick={() => { setPredictDisplay(true) }}>Show Prediction</button>
        <button className="Hide_Predict" onClick={() => { setPredictDisplay(false) }}>Hide Prediction</button>
      </div>
    );
  }
}

export default TimeLine