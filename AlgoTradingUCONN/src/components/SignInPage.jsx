// SignInPage.jsx
import React from 'react';
import { signInWithGoogle } from '../services/firebase';
import '../styles/SignInPage.css'; // You can create a new CSS file for styling this page
import '../App.css';
import SignInBG from './SignInBG';


const SignInPage = () => {
  return (
    <div className="signin-page">
      <h1>Welcome To AlgoTradingUCONN!</h1>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
      <SignInBG/>
    </div>
  );
};

export default SignInPage;
