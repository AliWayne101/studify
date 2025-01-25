'use client';

import React, { useState, useEffect } from 'react'
import "../css/login.scss";
import Footer from '../sections/footer';
import Button from '../components/Button';
import { signIn, useSession } from 'next-auth/react';
import Logo from '../sections/Logo';
import Body from '../sections/Body';
import Error from '../components/ErrorContainer';
import Navbar from '../sections/Navbar';
import { useRouter } from 'next/navigation';
import Loading from '../components/Loading';
import { ShowToast } from '../utilsjsx';

const Login = () => {
  const [errorFill, setErrorFill] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginDetails, setLoginDetails] = useState({
    uid: "",
    password: ""
  });
  const { data: session, status } = useSession();
  const router = useRouter();
  const [addBlur, setAddBlur] = useState(false);

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
    setIsLoading(true);
    if (!loginDetails.uid || !loginDetails.password) {
      setErrorFill("Please fill all the fields");
      setIsLoading(false);
      return;
    }

    await signIn('credentials', {
      redirect: false,
      email: loginDetails.uid,
      password: loginDetails.password
    }).then((response) => {
      if (!response?.ok) {
        ShowToast("Error", "Incorrect username/password, please try again", null);
        setIsLoading(false);
      }
      setErrorFill(null);
    }).catch((err) => {
      setIsLoading(false);
      setErrorFill("There was an error, please try again!");
    })
  }

  return (
    <>
      <Navbar updateParentState={setAddBlur} />
      <main className={`${addBlur && 'blur'}`}>
        <Logo />
        <Body>
          <Error error={errorFill} />
          <div className="loginform">
            {isLoading ?
              <Loading Size={96} />
              :
              <div className="login">
                <div className="login-in">
                  <input onChange={handleChange} type="text" name="uid" id="uid" />
                  <label htmlFor="uid">UID / E-mail</label>
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
      <div className={`${addBlur && 'blur'}`}>
        <Footer />
      </div>
    </>
  )
}

export default Login