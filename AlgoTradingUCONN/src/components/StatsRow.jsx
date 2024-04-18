import React from 'react'
import "../styles/StatsRow.css"
import StockSVG from "../assets/stock.svg"
import stocknegative from "../assets/stocknegative.svg"

function StatsRow(props) {

  const percentage = ((props.price - props.openPrice) / props.openPrice) * 100;
  const stockImage = percentage < 0 ? stocknegative : StockSVG;

  return (
    <div className="row">
      <div className="row__intro">
        <h1>{props.name}</h1>
        <p>
          {props.volume &&
          (props.volume + " shares")
          }
        </p>
      </div>
      <div className="row__chart">
        <img src={stockImage} alt ="Stock Trend" height={16}/>
      </div>
      <div className="row__numbers">
        <p className="row__price">${props.price.toFixed(2)}</p>
        <p className="row__percentage">{Number(percentage).toFixed(2)}%</p>
      </div>
    </div>
  )
}

export default StatsRow