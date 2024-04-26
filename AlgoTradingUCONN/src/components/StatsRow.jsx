import "../styles/StatsRow.css"
import StockSVG from "../assets/stock.svg"
import stocknegative from "../assets/stock-red.svg"

function StatsRow(props) {

  const percentage = ((props.price - props.openPrice) / props.openPrice) * 100;
  const stockImage = percentage < 0 ? stocknegative : StockSVG;
  const percentageColor = percentage < 0 ? "red" : "green";

  function isPortfolio(flag,name,setSelectStock){
    if(flag){
      flag("portfolio");
    }
    setSelectStock(name);
  }

  return (
    <button className="row" onClick={() => isPortfolio(props.flag,props.name,props.setSelectStock)}>
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
        <p className="row__percentage" style={{ color: percentageColor }}>{Number(percentage).toFixed(2)}%</p>
      </div>
    </button>
  )
}

export default StatsRow
