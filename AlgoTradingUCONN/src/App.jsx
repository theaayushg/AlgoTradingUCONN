import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import auth from './services/firebase';
import Header from './components/Header';
import Invest from './components/Invest';
import AddFunds from './components/AddFunds';
import AboutUs from './components/AboutUs';
import Account from './components/Account';
import Graph from './components/Graph';
import NewsFeed from './components/NewsFeed';
import Stats from './components/Stats';
import SignInPage from './components/SignInPage';
import { db } from './services/firebase';
import { doc, getDoc } from "firebase/firestore";
import { getStockData } from "./components/Stats";
import './App.css';

//current bug, user has nothing in portfolio, everything breaks.

function App() {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [main_portfolio, setPortfolio] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [selectStock,setSelectStock]=useState("AAPL");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  useEffect(() => {
    if (user) {
      getMyStocks(user);
    }
  }, [user]);

  useEffect(() => {
    const stocksList = ['AAPL', 'MSFT', 'JNJ', 'PG', 'KO', 'XOM', 'WMT', 'IBM', 'GE', 'F', 'GOOGL', 'AMZN', 'META', 'TSLA', 'NFLX', 'INTC', 'AMD', 'NVDA', 'V', 'PYPL'];

    let tempStockData = []
    let promises = [];
    stocksList.map((stock) => {
      promises.push(
        getStockData(stock)
          .then((res) => {
            tempStockData.push({
              name: stock,
              ...res.data
            });
          })
      )
    });

    Promise.all(promises).then(() => {
      setStockData(tempStockData);
    })

  }, []);

  const getMyStocks = async (user) => {
    let promises = [];
    let tempData = [];

    const userIdString = user.uid
    const userRef = doc(db, 'user_test', userIdString);
    const userDoc = await getDoc(userRef);

    if (userDoc && userDoc.data().Portfolio) {
      const portfolio = userDoc.data().Portfolio;
      Object.keys(portfolio).forEach(ticker => {
        const cur_stockData = portfolio[ticker];
        promises.push(
          getStockData(ticker)
            .then(res => {
              tempData.push({
                ticker: ticker,
                avgSharePrice: cur_stockData.BuyPrice,
                numShares: cur_stockData.Shares,
                info: res.data,
              });
            })
            .catch(error => {
              console.error(`Error fetching stock data for ${ticker}:`, error);
            })
        );
      });

      Promise.all(promises)
        .then(() => {
          setPortfolio(tempData);
        })
        .catch(error => {
          console.error('Error fetching stock data:', error);
        });
    }
  };

    return (
      <Router>
        <div className="app">
          {/* Header - you may want to hide this if not logged in */}
          {user && <div className="app__header">
            <Header user={user} balance={balance} setBalance={setBalance} />
          </div>}
          {/* Body */}
          <div className="app__body">
            <Routes>
              <Route path="/AboutUs" element={<AboutUs />} />
              <Route path="/" element={user ? <Navigate to="/portfolio" /> : <SignInPage />} />
  
              <Route path="/portfolio" element={user ? <div className="app__container">
                <NewsFeed user_portfolio={main_portfolio} selectStock={selectStock} stockData={stockData}/>
                <Stats stockData={stockData} user_portfolio={main_portfolio} setSelectStock={setSelectStock}/>
              </div> : <Navigate to="/" />} 
              />

              <Route path="Invest" element={user ? 
                <div className="app__container">
                  <Invest user={user} stockData={stockData} user_portfolio={main_portfolio} setPortfolio={setPortfolio} balance={balance} setBalance={setBalance}/>
                </div>
                : <Navigate to="/" />}
              />

              <Route path="/account" element={user ? 
                <div>
                  <div>
                    <AddFunds user={user} balance={balance} setBalance={setBalance} />
                  </div>
                  <div>
                    <Account userid={user.uid} setUser={setUser} setPortfolio={setPortfolio} />
                  </div>
                </div> : <Navigate to="/" />} />
              </Routes>
          </div>
        </div>
      </Router>
    );
  }
  
  export default App;
