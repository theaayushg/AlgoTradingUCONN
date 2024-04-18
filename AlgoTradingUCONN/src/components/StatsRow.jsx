import React from 'react'
import "../styles/StatsRow.css"
import StockSVG from "../assets/stock.svg"

function StatsRow(props) {

  const percentage = ((props.price - props.openPrice) / props.openPrice) * 100;

  return (
    <button className="row" onClick={() => props.setSelectStock(props.name)}>
      <div className="row__intro">
        <h1>{props.name}</h1>
        <p>
          {props.volume &&
          (props.volume + " shares")
          }
        </p>
      </div>
      <div className="row__chart">
        <img src={StockSVG} height={16}/>
      </div>
      <div className="row__numbers">
        <p className="row__price">${props.price.toFixed(2)}</p>
        <p className="row__percentage">{Number(percentage).toFixed(2)}%</p>
      </div>
    </button>
  )
}

export default StatsRow