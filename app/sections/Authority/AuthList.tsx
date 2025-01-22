"use client"
import React, { useEffect, useState } from 'react';
import "../../css/sections/Authority/basic.scss";
import { SessionProps } from '@/interfaces';
import { IUserInfo } from '@/schema/userinfo';
import "../../css/sections/Authority/list.scss";
import Image from 'next/image';
import { getImageLink } from '@/utils';

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
        <div className="list">
            <h2>{listTitle}</h2>
            <div className="list-cards">
                {userInfo?.map((doc, index) => (
                    <div className="list-cards-card" key={index}>
                        <div className="list-cards-card-image">
                            <Image height={1000} width={1000} src={getImageLink(doc.Image)} alt={doc.Name} />
                        </div>
                        <ul>
                            <li><span>Name:</span> {doc.Name}</li>
                            <li><span>Role:</span> {doc.Role}</li>
                            <li><span>CNIC:</span> {doc.CNIC}</li>
                            <li><span>Phone:</span> {doc.Phone}</li>
                            <li><span>DOB:</span> {new Date(doc.DOB.toString()).toLocaleDateString('en-GB')}</li>
                            <li><span>Joining Date:</span> {new Date(doc.JoinedOn.toString()).toLocaleDateString('en-GB')}</li>
                            <li>Address <br /> <small>{doc.Address}</small></li>
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AuthList;