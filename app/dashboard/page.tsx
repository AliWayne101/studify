"use client"
import React, { useState } from 'react'
import "../css/dashboard.scss"
import AuthList from '../sections/Authority/AuthList'
import { useSession } from 'next-auth/react'
import Basic from '../sections/Authority/Basic'
import Loading from '../components/Loading'
import Menu from '../sections/Authority/Menu'
import Struct from '../Struct'
import LoadingScreen from '../components/LoadingScreen'

const Dashboard = () => {
  const { data: session } = useSession();
  const [isLoadingCompleted, setIsLoadingCompleted] = useState(false);

  return (
    <Struct LoadingCompleted={setIsLoadingCompleted}>
      <LoadingScreen IsLoadingCompleted={isLoadingCompleted}>
        <div className="dash">
          <div className="dash-intro">
            <h1>Hi, {session?.user.name}</h1>
            {session?.user.role !== "Parent" &&
              <small><span>{session?.user.role}</span> of <b>{session?.user.schoolName}</b></small>
            }

          </div>
          <Menu session={session} />
          <Basic session={session} />
          <AuthList session={session} />
        </div>
      </LoadingScreen>
    </Struct>
  )
}

export default Dashboard