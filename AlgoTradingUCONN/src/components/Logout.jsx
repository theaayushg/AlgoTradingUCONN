import React from 'react';
import { auth } from '../services/firebase'
import { useNavigate } from 'react-router-dom';
import "../styles/Logout.css"

const Logout = () => {
  return (
      <button className="button__signout" onClick={() => auth.signOut()}>Sign out</button>
  )
}

export default Logout;
