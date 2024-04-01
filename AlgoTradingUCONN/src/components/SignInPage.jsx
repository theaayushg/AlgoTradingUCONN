// SignInPage.jsx
import React from 'react';
import { signInWithGoogle } from '../services/firebase';
import '../styles/SignInPage.css'; // You can create a new CSS file for styling this page
import '../App.css';
import ThreeScene from './SignInBG';

const SignInPage = () => {
  return (
    <div>
      <div className="signin-page">
        <ThreeScene/>
        <h1>Welcome to Algo Trading Simulator</h1>
        <button onClick={signInWithGoogle}>Sign in with Google</button>
      </div>
    </div>
  );
};

export default SignInPage;
