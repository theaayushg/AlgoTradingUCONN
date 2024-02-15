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
import './App.css';

//current issue: line 46, getting the add funds button to work

function App() {
  const [user, setUser] = useState(null);


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
        {/* Header */}
        <div className="app__header">
          <Header user={user}/>
        </div>
        {/* Body */}
        <div className="app__body">
          <Routes>
            <Route path="/" element={
              <div className="app__container">
                <NewsFeed />
                <Stats />
              </div>
            } />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/add-funds" element={<AddFunds user={user} />} />
            <Route path="/account" element={<Account />} />
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
