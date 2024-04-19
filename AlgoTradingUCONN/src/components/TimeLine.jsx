import React from 'react'
import '../styles/TimeLine.css'

function TimeLine({setPredictDisplay}) {
  return (
    <div className="timeline__container">
      <div className="timeline__buttons__container">
        <button className="Show_Predict" OnClick={() => {setPredictDisplay(true)}}>Show Prediction</button>
        <button className="Hide_Predict" OnClick={() => {setPredictDisplay(false)}}>Hide Prediction</button>
      </div>
    </div>
  )
}

export default TimeLine
