import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import auth from './services/firebase';
import Header from './components/Header';
import Portfolio from './components/Portfolio';
import AddFunds from './components/AddFunds';
import Account from './components/Account';
import Graph from './components/Graph';
import NewsFeed from './components/NewsFeed';
import Stats from './components/Stats';
import SignInPage from './components/SignInPage';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  ////pre pages change useEffect
  // useEffect(() => {
  //   auth.onAuthStateChanged(user => {
  //     setUser(user);
  //   })
  // }, [])

  //console.log(user);

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
              <Route path="/" element={user ? <Navigate to="/portfolio" /> : <SignInPage />} />
  
              <Route path="/portfolio" element={user ? <div className="app__container">
                {/* <Portfolio />  is currently just text */} 
                <NewsFeed />
                <Stats />
              </div> : <Navigate to="/" />} 
              />
              <Route path="/add-funds" element={user ? <AddFunds user={user} balance={balance} setBalance={setBalance} /> : <Navigate to="/" />} />
              <Route path="/account" element={user ? <Account /> : <Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </Router>
    );
  }
  
  export default App;


// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vitejs.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App
