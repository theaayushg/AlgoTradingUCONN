import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/Connecticut_Huskies_logo.svg';
import { DisplayUserInfo } from './DisplayUserInfo';
import '../styles/Header.css';

function Header({ user, balance, setBalance }) {
  //const [currentBalance, setCurrentBalance] = useState(0);

  const handleBalanceChange = (newBalance) => {
    setBalance(newBalance);
  }

  return (
    <div className="header__wrapper">
      {/* logo */}
      <div className="header__logo">
        <Link to ="/">
          <img src={Logo} />
        </Link>
      </div>
      {/* page title */}
        <h1 className="header__title"> AlgoTradingUCONN</h1>
      {/* menuitems */}
      <div className="header__menuItems"> 
        <Link to="/AboutUs">AboutUs</Link>
        <Link to="/Invest">Invest</Link>
        <Link to="/account">Account Management</Link>
      </div>
      <div className="header_userInfo">
        < DisplayUserInfo user={user} onBalanceChange={handleBalanceChange} balance={balance} setBalance={setBalance} />
      </div>
    </div>
  )
}

export default Header