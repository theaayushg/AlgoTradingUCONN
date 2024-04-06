import React, { useState, useEffect } from 'react';
import {DocumentSnapshot, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import Login from './Login';
import Logout from './Logout';
import '../styles/DisplayUserInfo.css';

export function DisplayUserInfo({ user, balance, setBalance, onBalanceChange }) {
  const fallbackImageUrl = 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fphotos%2Fuser-profile&psig=AOvVaw2Vm_odSVOsoydD_nS912ve&ust=1701632213627000&source=images&cd=vfe&ved=0CBIQjRxqFwoTCPjp5I7A8YIDFQAAAAAdAAAAABAE';
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !user.uid) {
      setLoading(false);
      return;
    }

    const userRef = doc(db, "user_test", user.uid);

    const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const newBalance = docSnapshot.data().balance || 0;
        setBalance(newBalance);

        if (onBalanceChange) {
          onBalanceChange(newBalance);
        }
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    }

  }, [user, onBalanceChange]);

  if (loading) {
    return <div>Loading ...</div>;
  }

  if (!user) {
    return (
      <div className="user-info-container">
        <div className="user-info-login">
          <Login />
        </div>
      </div>
    )
  }

  return (
    <div className="user-info-container">
      
      <div className="user-info-left">
        <p>{user.displayName || 'No Display Name'}</p>
        <p>Balance: ${balance.toFixed(2)}</p>
        <Logout />
      </div>
      
      <div className="user-info-right">
        <img src={user.photoURL || fallbackImageUrl} alt="User"/>
      </div>

    </div>
  );
}