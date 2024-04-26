import React from 'react'
import '../styles/TimeLine.css'

function TimeLine({setPredictDisplay, setViewPerformance, viewPerformance}) {
  return (
    <div className="timeline__container">
      <div className="timeline__buttons__container">
        <button className="Show_Predict" onClick={() => {setPredictDisplay(true)}}>Show Prediction</button>
        <button className="Hide_Predict" onClick={() => {setPredictDisplay(false)}}>Hide Prediction</button>
        <button onClick={() => setViewPerformance(!viewPerformance)}>Show Performance</button>
      </div>
    </div>
  )
}

export default TimeLine
