"use client"
import "../css/profile.scss";
import React, { useEffect, useState } from 'react'
import Struct from '../Struct'
import LoadingScreen from '../components/LoadingScreen'
import { useSession } from 'next-auth/react'
import { IUserInfo } from '@/schema/userinfo'
import { getImageLink, sendRequest } from '@/utils'
import { ShowToast } from '../utilsjsx'
import Image from "next/image";
import Button from "../components/Button";

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
        <div className="profile">
          <div className="profile-left">
            <div className="profile-left-image">
              <Image src={getImageLink(profileData?.Image)} height={1024} width={1024} alt={profileData ? profileData.Name : "null"} />
            </div>
            <div className="profile-left-below">
              <Button onClick={() => console.log("Good")}>Upload</Button>
            </div>
          </div>
          <div className="profile-right">
            <h2>Profile</h2>
            
          </div>
        </div>
      </LoadingScreen>
    </Struct>
  )
}

export default Profile