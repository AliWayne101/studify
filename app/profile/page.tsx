"use client"
import React, { useState } from 'react'
import Struct from '../Struct'
import LoadingScreen from '../components/LoadingScreen'
import { useSession } from 'next-auth/react'

const Profile = () => {
  const [isLoadingCompleted, setIsLoadingCompleted] = useState(false);

  const {data: session} = useSession();

  return (
    <Struct LoadingCompleted={setIsLoadingCompleted}>
      <LoadingScreen IsLoadingCompleted={isLoadingCompleted}>
        <div className="">Good</div>
      </LoadingScreen>
    </Struct>
  )
}

export default Profile