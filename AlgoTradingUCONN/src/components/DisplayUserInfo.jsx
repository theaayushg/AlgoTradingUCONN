import React from 'react';
import Login from './Login';
import Logout from './Logout';
import '../styles/DisplayUserInfo.css';

export function DisplayUserInfo({ user }) {

  if(!user) {
    return <Login />
  }

  const fallbackImageUrl = 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fphotos%2Fuser-profile&psig=AOvVaw2Vm_odSVOsoydD_nS912ve&ust=1701632213627000&source=images&cd=vfe&ved=0CBIQjRxqFwoTCPjp5I7A8YIDFQAAAAAdAAAAABAE';

  return (
    <div className="user-info-container">
      
      <div className="user-info-left">
        <h6>{user.displayName || 'No Display Name'}</h6>
        <h6>Balance: $0.00 </h6>
        <Logout />
      </div>
      
      <div className="user-info-right">
        <img src={user.photoURL || fallbackImageUrl} alt="User"/>
      </div>

    </div>
  );
}