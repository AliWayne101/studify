"use client"
import React from 'react'
import "../css/dashboard.scss"
import AuthList from '../sections/Authority/AuthList'
import { useSession } from 'next-auth/react'
import Basic from '../sections/Authority/Basic'
import Loading from '../components/Loading'
import Menu from '../sections/Authority/Menu'
import Struct from '../Struct'

const Dashboard = () => {
  const { data: session, status } = useSession();

  return (
    <Struct>
      {session ? (
        <div className="dash">
          <div className="dash-intro">
            <h1>Hi, {session?.user.name}</h1>
            <small><span>{session?.user.role}</span> of <b>{session?.user.schoolName}</b></small>
          </div>
          <Basic session={session} />
          <Menu session={session} />
          <AuthList session={session} />
        </div>
      ) : <Loading Size={48} />}
    </Struct>
  )
}

export default Dashboard