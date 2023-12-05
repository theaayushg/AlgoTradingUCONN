import React from 'react';
import { auth } from '../services/firebase'
import '../App.css';

const Logout = () => {
  return (
    <div className="logout">
      <button className="button signout" onClick={() => auth.signOut()}>Sign out</button>
    </div>
  )
}

export default Logout;
