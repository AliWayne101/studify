'use client';

import React, { useState } from 'react'
import "../css/login.scss";
import Footer from '../sections/footer';
import Button from '../components/Button';
import { signIn } from 'next-auth/react';
import Logo from '../sections/Logo';
import Body from '../sections/Body';
import Error from '../components/Error';

const Login = () => {

  const [errorFill, setErrorFill] = useState<string | null>(null);
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
    if (!loginDetails.email || !loginDetails.password) {
      setErrorFill("Please fill in all fields");
      return;
    }

    console.log('Handling signin...');
    await signIn('credentials', {
      redirect: false,
      email: loginDetails.email,
      password: loginDetails.password
    }).then((response) => {
      console.log(response);
      setErrorFill(null);
    }).catch((err) => {
      console.log("Error");
      setErrorFill("Error");
      console.log(err);
    })
  }

  return (
    <>
      <main>
        <Logo />
        <Body>
          <Error error={errorFill} />
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
        </Body>
      </main>
      <Footer />
    </>
  )
}

export default Login