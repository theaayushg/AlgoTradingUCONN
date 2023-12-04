import React from 'react'
import Logo from '../assets/Connecticut_Huskies_logo.svg'
import { DisplayUserInfo } from './DisplayUserInfo'
import '../styles/Header.css';

function Header({ user }) {
  return (
    <div className="header__wrapper">
      {/* logo */}
      <div className="header__logo">
        <img src={Logo} />
      </div>
      {/* page title */}
        <h1 className="header__title"> Team 38 Algorithmic Trading Simulator</h1>
      {/* menuitems */}
      <div className="header__menuItems">
        <a href="#">Portfolio</a>
        <a href="#">Add Funds</a>
        <a href="#">Account</a>
      </div>
      <div className="header_userInfo">
        < DisplayUserInfo user={user}/>
      </div>
    </div>
  )
}

export default Header