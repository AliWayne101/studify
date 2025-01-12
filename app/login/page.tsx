'use client';

import React, { useState, useEffect } from 'react'
import "../css/login.scss";
import Footer from '../sections/footer';
import Button from '../components/Button';
import { signIn, useSession } from 'next-auth/react';
import Logo from '../sections/Logo';
import Body from '../sections/Body';
import Error from '../components/Error';
import Navbar from '../sections/Navbar';
import { useRouter } from 'next/navigation';

const Login = () => {
  const [errorFill, setErrorFill] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginDetails, setLoginDetails] = useState({
    uid: "",
    password: ""
  });
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session != undefined) {
      setIsLoading(true);
      if (session) {
        router.push('/dashboard');
      } else {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginDetails({
      ...loginDetails,
      [e.target.name]: e.target.value
    });
  }

  const HandleLogin = async () => {
    console.log('Handling signin...');

    if (!loginDetails.uid || !loginDetails.password) {
      setErrorFill("Please fill all the fields");
      return;
    }

    await signIn('credentials', {
      redirect: false,
      email: loginDetails.uid,
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
      <Navbar />
      <main>
        <Logo />
        <Body>
          <Error error={errorFill} />
          <div className="loginform">
            {isLoading ?
              <div className="loading">Loading...</div>
              :
              <div className="login">
                <div className="login-in">
                  <input onChange={handleChange} type="text" name="uid" id="uid" />
                  <label htmlFor="uid">UID</label>
                </div>
                <div className="login-in">
                  <input onChange={handleChange} type="password" name="password" id="password" />
                  <label htmlFor="password">Password</label>
                </div>
                <Button onClick={HandleLogin}>Login</Button>
              </div>
            }
          </div>
        </Body>
      </main>
      <Footer />
    </>
  )
}

export default Login