"use client"
import "../css/profile.scss";
import "../css/login.scss";
import React, { useEffect, useState } from 'react'
import Struct from '../Struct'
import LoadingScreen from '../components/LoadingScreen'
import { useSession } from 'next-auth/react'
import { IUserInfo } from '@/schema/userinfo'
import { getImageLink, isPasswordValid, sendRequest } from '@/utils'
import { ShowToast } from '../utilsjsx'
import Image from "next/image";
import Button from "../components/Button";

const Profile = () => {
  const [isLoadingCompleted, setIsLoadingCompleted] = useState(false);
  const [profileData, setProfileData] = useState<IUserInfo>();
  const [blockEdit, setBlockEdit] = useState(true);
  const [saveProfile, setSaveProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState("");
  const { data: session } = useSession();

  useEffect(() => {
    if (session)
      getUser();
  }, [session])

  const getUser = async () => {
    setIsLoadingCompleted(false);
    const response = await sendRequest("/api/posts", {
      Request: "getuserbyid",
      uid: session?.user.uid
    });
    if (response.message === "OK")
      setProfileData(response.results.doc);
    else
      ShowToast("Error", "Unable to fetch data from server, please refresh the page", null);

    setIsLoadingCompleted(true);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    if (profileData) {
      setProfileData({
        ...profileData,
        [e.target.name]: e.target.value
      });
    }
  }

  const MakeChanges = async () => {
    setIsLoadingCompleted(false);
    if (!profileData) return;
    const response = await sendRequest("/api/posts", {
      Request: "edituser",
      uid: session?.user.uid,
      Name: profileData?.Name,
      Email: profileData?.Email,
      Gender: profileData?.Gender,
      Phone: profileData?.Phone,
      DOB: profileData?.DOB,
      Password: changingPassword
    });
    if (response.message === "OK") {
      ShowToast("Success", "Profile updated successfully", null);
      setBlockEdit(true);
      setSaveProfile(false);
      setProfileData(response.results.doc);
    } else {
      ShowToast("Error", response.error, null);
    }
    setIsLoadingCompleted(true);
  }

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
            {
              saveProfile ?
                <>
                  <h3>Confirm</h3>
                  <p>Please fill in your password to make changes</p>
                  <div className="login">
                    <div className="login-in">
                      <input autoComplete="false" onChange={(e) => setChangingPassword(e.target.value)} type="password" name="Password" id="Password" />
                      <label htmlFor="Name">Password</label>
                    </div>
                    <Button onClick={MakeChanges}>Save Changes</Button>
                    <Button onClick={() => setSaveProfile(false)}>Cancel</Button>
                  </div>
                </>
                :
                <>
                  <div className="profile-right-edit">
                    <Button onClick={() => setBlockEdit(!blockEdit)}>{blockEdit ? "Enable" : "Disable"} Edit</Button>
                  </div>
                  <div className="login">
                    <div className="login-in">
                      <input disabled={blockEdit} onChange={handleChange} type="text" name="Name" id="Name" value={profileData?.Name || ''} />
                      <label htmlFor="Name">Name</label>
                    </div>
                    <div className="login-in">
                      <input disabled={blockEdit} onChange={handleChange} type="email" name="Email" id="Email" value={profileData?.Email || ''} />
                      <label htmlFor="Email">Email</label>
                    </div>
                    <div className="login-in">
                      <select disabled={blockEdit} name="Gender" id="Gender" onChange={handleChange}>
                        <option className='bg' value="">Select Gender</option>
                        <option className='bg' value="Male">Male</option>
                        <option className='bg' value="Female">Female</option>
                      </select>
                      <label htmlFor="Gender">Gender</label>
                    </div>
                    <div className="login-in">
                      <input disabled={blockEdit} onChange={handleChange} type="text" name="Phone" id="Phone" value={profileData?.Phone || ''} />
                      <label htmlFor="Phone">Phone</label>
                    </div>
                    <div className="login-in">
                      <input disabled={blockEdit} onChange={handleChange} type="date" name="DOB" id="DOB" value={profileData?.DOB ? (new Date(profileData.DOB.toString())).toISOString().split('T')[0] : ''} />
                      <label htmlFor="DOB">Date of Birth</label>
                    </div>
                    <Button onClick={() => setSaveProfile(true)}>Confirm</Button>
                  </div>
                </>
            }

          </div>
        </div>
      </LoadingScreen>
    </Struct>
  )
}

export default Profile