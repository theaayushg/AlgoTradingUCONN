import React from 'react';
import { auth } from '../services/firebase'
import { useNavigate } from 'react-router-dom';
import "../styles/Logout.css"



const Logout = ({ setUser, setPortfolio }) => {

  const logOutUser = () => {
    auth.signOut();
    //setUser(null);
    setPortfolio([]);
  };

  return (
      <button className="button__signout" onClick={() => logOutUser()}>Sign out</button>
  )
}

export default Logout;
