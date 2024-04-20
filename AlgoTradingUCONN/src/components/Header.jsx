import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/Connecticut_Huskies_logo.svg';
import { DisplayUserInfo } from './DisplayUserInfo';
import '../styles/Header.css';

function Header({ user, balance, setBalance }) {

  const handleBalanceChange = (newBalance) => {
    setBalance(newBalance);
  }

  return (
    <div className="header__wrapper">
      {/* logo */}
      <div className="header__logo">
        <Link to="/">
          <img src={Logo} alt="AlgoTradingUCONN Logo" />
        </Link>
      </div>
      {/* page title */}
      <h1 className="header__title">AlgoTradingUCONN</h1>
      {/* menu items */}
      <div className="header__menuItems">
        <Link to="/AboutUs">About Us</Link>
        <Link to="/Learn">Learn</Link>
        <Link to="/Invest">Invest</Link>
        <Link to="/account">Account Management</Link>
      </div>
      {/* user info */}
      <div className="header__userInfo">
        <DisplayUserInfo user={user} onBalanceChange={handleBalanceChange} balance={balance} setBalance={setBalance} />
      </div>
    </div>
  )
}

export default Header;
