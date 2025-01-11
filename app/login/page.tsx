'use client';

import React, { useState } from 'react'
import { WebDetails } from '@/configs';
import "../css/login.scss";
import "../css/sections/hero.scss";
import Footer from '../sections/footer';
import Button from '../components/Button';
import { signIn } from 'next-auth/react';

const Login = () => {

  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginDetails({
      ...loginDetails,
      [e.target.name]: e.target.value
    });
  }

  const HandleLogin = async () => {
    console.log('Handling signin...');
    await signIn('credentials', {
      redirect: false,
      email: loginDetails.email,
      password: loginDetails.password
    }).then((response) => {
      console.log(response);
    }).catch((err) => {
      console.log("Error");
      console.log(err);
    })
  }

  return (
    <>
      <main>
        <div className="hero">
          <h1>{WebDetails.webName}</h1>
          <p>{WebDetails.webMotto}</p>
        </div>
        <div className="body-cont">
          <div className="error">Text</div>
          <div className="loginform">
            <div className="login">
              <div className="login-in">
                <input onChange={handleChange} type="email" name="email" id="email" />
                <label htmlFor="email">Email</label>
              </div>
              <div className="login-in">
                <input onChange={handleChange} type="password" name="password" id="password" />
                <label htmlFor="password">Password</label>
              </div>
              <Button onClick={HandleLogin}>Login</Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default Login