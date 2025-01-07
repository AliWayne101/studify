import React from 'react'
import { WebDetails } from '@/configs';
import "../css/login.scss";

const Login = () => {
  return (
    <>
      <main>
        <div className="hero">
          <h1>{WebDetails.webName}</h1>
          <p>{WebDetails.webMotto}</p>
        </div>
        <div className="login">
          <div className="login-in">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" id="email" />
          </div>
          <div className="login-in">
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" />
          </div>
        </div>
        <div className="cta">Login</div>
      </main>
    </>
  )
}

export default Login