"use client"
import React, { useState } from 'react'
import Logo from '../sections/Logo'
import Body from '../sections/Body'
import Footer from '../sections/footer'
import "../css/dashboard.scss"
import AuthList from '../sections/Authority/AuthList'
import { useSession } from 'next-auth/react'
import Navbar from '../sections/Navbar'
import Basic from '../sections/Authority/Basic'
import Loading from '../components/Loading'

const Dashboard = () => {
  const { data: session, status } = useSession();
  const [addBlur, setAddBlur] = useState(false);

  return (
    <>
      <Navbar updateParentState={setAddBlur} />
      <main className={`${addBlur && 'blur'}`}>
        <Logo />
        <Body>
          {session ? (
            <div className="dash">
              <div className="dash-intro">
                <h1>Hi, {session?.user.name}</h1>
                <small><span>{session?.user.role}</span> of <b>{session?.user.schoolName}</b></small>
              </div>
              <Basic session={session} />
              <AuthList session={session} />
            </div>
          ) : <Loading Size={48} />}

        </Body>
      </main>
      <div className={`${addBlur && 'blur'}`}>
        <Footer />
      </div>
    </>
  )
}

export default Dashboard