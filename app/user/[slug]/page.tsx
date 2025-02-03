'use client'
import "../../css/profile.scss";
import "../../css/user.scss";
import LoadingScreen from '@/app/components/LoadingScreen';
import Struct from '@/app/Struct';
import { CompleteUserData, SlugProps } from '@/interfaces';
import { fillAttendanceData, getImageLink, sendRequest } from '@/utils';
import React, { useEffect, useState } from 'react'
import Image from "next/image";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Calender from '@/app/components/Calender';
import { ShowToast } from "@/app/utilsjsx";

const ViewUser = ({ params }: SlugProps) => {
    const [isLoadingCompleted, setIsLoadingCompleted] = useState(false);
    const [userData, setUserData] = useState<CompleteUserData | undefined>(undefined);
    const [slug, setSlug] = useState("");

    const { data: session } = useSession();

    useEffect(() => {
        const getSlug = async () => {
            const _slug = (await params).slug;
            setSlug(_slug);
        }
        getSlug();
    }, [params]);

    useEffect(() => {
        const getUser = async () => {
            setIsLoadingCompleted(false);
            const response = await sendRequest('/api/posts', {
                Request: "userprofile",
                UID: slug
            });
            if (response.message === "OK")
                setUserData(response.results.doc);
            else
                ShowToast("User", response.error, null);
            setIsLoadingCompleted(true);
        }
        if (slug !== "")
            getUser();
    }, [slug])

    return (
        <Struct LoadingCompleted={setIsLoadingCompleted}>
            <LoadingScreen IsLoadingCompleted={isLoadingCompleted}>
                {userData &&
                    <div className="profile">
                        <div className="profile-left">
                            <div className="profile-left-image">
                                <div className="img-cont">
                                    <Image
                                        layout="fill"
                                        objectFit="cover"
                                        src={getImageLink(userData?.User?.Image)}
                                        alt={userData?.User ? userData.User.Name : "null"} />
                                </div>
                            </div>
                            <div className="profile-left-below">
                                Status:&nbsp;<span>{userData?.User?.isActive ? "Active" : "Inactive"}</span>
                            </div>
                        </div>
                        <div className="profile-right">
                            <h3>User Information</h3>
                            <p>Detailed information of user</p>
                            <ul>
                                <li>Name: <b>{userData?.User?.Name}</b></li>
                                <li>Email: <b>{userData?.User?.Email}</b></li>
                                {session?.user.role === "Owner" || session?.user.role === "Admin" && <>
                                    <li>CNIC: <b>{userData?.User?.CNIC}</b></li>
                                    <li>Gender: <b>{userData?.User?.Gender}</b></li>
                                    <li>Phone: <b>{userData?.User?.Phone}</b></li>
                                </>}
                                <li>Role: <b>{userData?.User?.Role}</b></li>
                                <li>Date of Birth: <b>{userData?.User && new Date(userData.User.DOB).toLocaleDateString()}</b></li>
                                <li>Date of Joining: <b>{userData?.User && new Date(userData.User.JoinedOn).toLocaleDateString()}</b></li>

                            </ul>
                            {userData && userData.Class && <>
                                <h3>Class Information</h3>
                                <p>Details about user class</p>
                                <ul>
                                    <li>Class: <b>{userData?.Class?.Name}</b></li>
                                    <li>Teacher: <b>{userData?.Teacher?.Name}</b></li>
                                </ul>
                                {userData && userData.Guardians.length > 0 && <>
                                    <h3>Guardian Information</h3>
                                    <p>List of student&apos;s Guardians</p>
                                    <ul>
                                        {userData?.Guardians.map((user) => (
                                            <li key={user.UID}><Link href={`/user/${user.UID}`}>{user.Name} <small>{user.Gender}</small></Link></li>
                                        ))}
                                    </ul>
                                </>}
                            </>}

                            {userData && userData.Children.length > 0 && <>
                                <h3>Children Information</h3>
                                <p>List of children</p>
                                <ul>
                                    {userData?.Children.map((user) => (
                                        <li key={user.UID}><Link href={`/user/${user.UID}`}>{user.Name} <small>{user.Gender}</small></Link></li>
                                    ))}
                                </ul>
                            </>}
                            <h3>Attendance Information</h3>
                            <p>Basic Attendance Information</p>
                            <Calender data={fillAttendanceData(userData?.Attendance?.Attendance)} />
                        </div>
                    </div>
                }
            </LoadingScreen>
        </Struct>
    )
}

export default ViewUser