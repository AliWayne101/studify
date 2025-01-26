"use client"
import React, { useEffect, useState } from 'react';
import { AttendanceStructProps, SessionProps } from '@/interfaces';
import { IUserInfo } from '@/schema/userinfo';
// import "../../css/sections/Authority/list.scss";
import "../../css/sections/Authority/authlist.scss";
import Image from 'next/image';
import { fillAttendanceData, getImageLink } from '@/utils';
import Calender from '@/app/components/Calender';
import { IAttendanceInfo } from '@/schema/attendanceinfo';

interface DataStructure {
    User: IUserInfo,
    Attendance: IAttendanceInfo
}

const AuthList = ({ session }: SessionProps) => {
    const [isError, setIsError] = useState<string | null>(null);
    const [userInfo, setUserInfo] = useState<IUserInfo[] | undefined>(undefined);
    const [uInfo, setUInfo] = useState<DataStructure|undefined>(undefined);
    const [attInfo, setAttInfo] = useState<IAttendanceInfo>();
    const [targetUser, setTargetUser] = useState<string|null>(null);
    const [listTitle, setListTitle] = useState("");
    const [tempTitle, setTempTitle] = useState("");

    //Under Development
    //get Attendance in getdashboarduinfo, and show the attendace through state relatively
    //show more info about user under attendance section
    //delete list.scss since its useless
    //Add Media screen
    //add ref to scroll to content

    const data: AttendanceStructProps[] = [
        { Day: 1, Status: "present" },
        { Day: 2, Status: "leave" },
        { Day: 3, Status: "present" },
        { Day: 5, Status: "absent" },
        { Day: 6, Status: "present" },
    ];

    useEffect(() => {
        var requestBody = {
            Request: "getdashboarduinfo",
            uid: session?.user.uid,
            targetRoll: "Student",
            schoolName: session?.user.schoolName,
            clause: "all"
        };

        if (session?.user.role === "Owner" || session?.user.role === "Admin") {
            requestBody.targetRoll = "Employees";
            setTempTitle("Employee Information");
        } else if (session?.user.role === "Teacher") {
            requestBody.clause = "class";
            setTempTitle("Student Information");
        } else if (session?.user.role === "Parent") {
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
                    const servData: IUserInfo[] = data.data;
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
    }, [session])

    const SelectedUser = (UID: string) => {
        setTargetUser(UID);
    }

    return (
        <div className={`autlist ${targetUser === null ? 'max' : 'min'}`}>
            <div className="authlist-left">
                <h2>{listTitle}</h2>
                <div className={`cards ${targetUser === null ? 'fourprow' : 'threeprow'}`}>
                    {userInfo?.map((data, index) => (
                        <div className="cards-card" key={index} onClick={() => SelectedUser(data.UID)}>
                            <div className="cards-card-img">
                                <div className="img-cont">
                                    <Image
                                        layout="fill"
                                        objectFit="cover"
                                        src={getImageLink(data.Image)}
                                        alt={data.Name}
                                    />
                                </div>
                            </div>
                            <div className="cards-card-details">
                                <ul>
                                    <li>{data.Name}</li>
                                    <li>{data.Role}</li>
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="authlist-right">
                <h2>Attendance Information</h2>
                <Calender data={fillAttendanceData(data)} />
            </div>
        </div>
    );
};

export default AuthList;