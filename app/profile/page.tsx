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
  const [photo, setPhoto] = useState<File | null>();
  const { data: session } = useSession();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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

  const PhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files[0]) {
      setPhoto(files[0]);
    }
  }

  const UploadProfilePic = async () => {
    if (photo === null || photo === undefined) return null;
    try {
      const formData = new FormData();
      formData.append('image', photo);
      const _url = `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API}`;
      const response = await fetch(_url, {
        method: "POST",
        body: formData
      });
      const data = await response.json();
      if (response.ok) {
        return data.data.url;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      ShowToast("Error", "There seems to be an error while uploading the image, please contact the developer if problem presists", null);
      return null;
    }

  }

  const MakeChanges = async () => {
    setIsLoadingCompleted(false);

    const imageLink = await UploadProfilePic();
    console.log(imageLink);
    if (!profileData) return;
    const response = await sendRequest("/api/posts", {
      Request: "edituser",
      uid: session?.user.uid,
      Name: profileData?.Name,
      Email: profileData?.Email,
      Gender: profileData?.Gender,
      Phone: profileData?.Phone,
      DOB: profileData?.DOB,
      ProfilePhoto: imageLink,
      Password: changingPassword
    });
    if (response.message === "OK") {
      ShowToast("Success", "Profile has been updated successfully!", null);
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
              <div className="img-cont">
                <Image
                  layout="fill"
                  objectFit="cover"
                  src={getImageLink(profileData?.Image)}
                  alt={profileData ? profileData.Name : "null"} />
              </div>
            </div>
            <div className="profile-left-below">
              <Button onClick={() => fileInputRef.current?.click()}>Upload</Button>
              <input type="file" name="Profile" id="Profile" onChange={PhotoUpload} ref={fileInputRef} style={{ display: 'none' }} />
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
                      <select disabled={blockEdit} name="Gender" id="Gender" onChange={handleChange} value={profileData?.Gender || ''}>
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