"use client"
import React, { useEffect, useState } from 'react'
import Struct from '../Struct'
import LoadingScreen from '../components/LoadingScreen'
import { useSession } from 'next-auth/react'
import { IUserInfo } from '@/schema/userinfo'
import { sendRequest } from '@/utils'
import { toast } from 'react-toastify'
import { ShowToast } from '../utilsjsx'

const Profile = () => {
  const [isLoadingCompleted, setIsLoadingCompleted] = useState(false);
  const [profileData, setProfileData] = useState<IUserInfo>();
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      const getUser = async () => {
        setIsLoadingCompleted(false);
        const response = await sendRequest("/api/posts", {
          Request: "getuserbyid",
          uid: session?.user.uid
        });
        if (response.message === "OK") {
          setProfileData(response.results.doc);
        } else {
          ShowToast("Error", "Unable to fetch data from server, please refresh the page", null);
        }
        setIsLoadingCompleted(true);
      }
      getUser();
    }
  }, [session])

  return (
    <Struct LoadingCompleted={setIsLoadingCompleted}>
      <LoadingScreen IsLoadingCompleted={isLoadingCompleted}>
        <div className="">{profileData?.Name}</div>
      </LoadingScreen>
    </Struct>
  )
}

export default Profile