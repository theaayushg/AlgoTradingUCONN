import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/Connecticut_Huskies_logo.svg';
import { DisplayUserInfo } from './DisplayUserInfo';
import { increaseBalance } from '../services/IncreaseBalance';
import '../styles/Header.css';

function Header({ user }) {
  const [currentBalance, setCurrentBalance] = useState(0);

  const handleBalanceChange = (newBalance) => {
    setCurrentBalance(newBalance);
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
        <h1 className="header__title"> Team 38 Algorithmic Trading Simulator</h1>
      {/* menuitems */}
      <div className="header__menuItems">
        <Link to="/portfolio">Portfolio</Link>
        <Link to="/add-funds">Add Funds</Link>
        <Link to="/account">Account</Link>
        {/* <a href="#">Portfolio</a>  
        <a href="#" onClick={handleAddFunds}>Add $10</a>
        <a href="#">Account</a> */}
      </div>
      <div className="header_userInfo">
        < DisplayUserInfo user={user} onBalanceChange={handleBalanceChange}/>
      </div>
    </div>
  )
}

export default Header