'use client';

import React from 'react'
import { WebDetails } from '@/configs';
import "../css/login.scss";
import "../css/sections/hero.scss";
import Footer from '../sections/footer';
import Button from '../components/Button';

const Login = () => {
  
  const HandleLogin = () => {
    console.log("Clicked");
  }
  
  return (
    <>
      <main>
        <div className="hero">
          <h1>{WebDetails.webName}</h1>
          <p>{WebDetails.webMotto}</p>
        </div>
        <div className="loginform">
          <div className="login">
            <div className="login-in">
              <input type="email" name="email" id="email" />
              <label htmlFor="email">Email</label>
            </div>
            <div className="login-in">
              <input type="password" name="password" id="password" />
              <label htmlFor="password">Password</label>
            </div>
            <Button onClick={HandleLogin}>Login</Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default Login