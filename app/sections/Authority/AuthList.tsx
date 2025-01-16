"use client"
import React, { useEffect, useState } from 'react';
import "../../css/sections/Authority/basic.scss";
import { SessionProps } from '@/interfaces';
import { isAuthorized } from '@/utils';
import List from './List';
import { IUserInfo } from '@/schema/userinfo';

const AuthList = ({ session }: SessionProps) => {
    const [isError, setIsError] = useState<string | null>(null);
    const [userInfo, setUserInfo] = useState<IUserInfo[]|undefined>(undefined);
    const [listTitle, setListTitle] = useState("");
    const [tempTitle, setTempTitle] = useState("");
    useEffect(() => {
        var requestBody = {
            Request: "getdashboarduinfo",
            uid: session.user.uid,
            targetRoll: "Student",
            schoolName: session.user.schoolName,
            clause: "all"
        };

        if (session.user.role === "Owner" || session.user.role === "Admin") {
            requestBody.targetRoll = "Employees";
            setTempTitle("Employee Information");
        } else if (session.user.role === "Teacher") {
            requestBody.clause = "class";
            setTempTitle("Student Information");
        } else if (session.user.role === "Parent") {
            requestBody.clause = "children";
            setTempTitle("Children Information");
        }

        const sendRequest = async () => {
            try {

                const response = await fetch('/api/posts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                });

                if (!response.ok) {
                    setIsError("Network response was not okay, please refresh the page");
                    return;
                }
                const data = await response.json();
                if (data.message === "OK") {
                    const servData:IUserInfo[] = data.data;
                    if (servData.length === 0)
                        setListTitle("");
                    else
                        setListTitle(tempTitle);
                    setUserInfo(servData);
                } else {
                    setIsError(data.error);
                }
            } catch (err) {
                setIsError("Seems to be an error, please refresh the page");
                console.log(err);
            }
        }
        sendRequest();
    }, [session.user.role])

    return (
        <List Title={listTitle} List={userInfo}/>
        // isAuthorized(session.user.role, ["SU", "HU"]) ? (
        // ) : null
    );
};

export default AuthList;