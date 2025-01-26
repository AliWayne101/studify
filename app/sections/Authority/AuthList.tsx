"use client"
import React, { useEffect, useState } from 'react';
import { AttendanceStructProps, ProperUserInterface, SessionProps } from '@/interfaces';
// import "../../css/sections/Authority/list.scss";
import "../../css/sections/Authority/authlist.scss";
import Image from 'next/image';
import { fillAttendanceData, getImageLink, sendRequest } from '@/utils';
import Calender from '@/app/components/Calender';
import { ShowToast } from '@/app/utilsjsx';

const AuthList = ({ session }: SessionProps) => {
    const [uInfo, setUInfo] = useState<ProperUserInterface[] | undefined>(undefined);
    const [attInfo, setAttInfo] = useState<AttendanceStructProps[] | undefined>(undefined);
    const [targetUser, setTargetUser] = useState<string | null>(null);

    //Under Development
    //show more info about user under attendance section
    //delete list.scss since its useless
    //Add Media screen
    //add ref to scroll to content
    //listTitle is glitching

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
        } else if (session?.user.role === "Teacher") {
            requestBody.clause = "class";
        } else if (session?.user.role === "Parent") {
            requestBody.clause = "children";
        }

        const sendRequests = async () => {
            try {
                const response = await sendRequest('/api/posts', requestBody);
                if (response.message === "OK") {
                    const servUserDetails: ProperUserInterface[] = response.results.docs;
                    setUInfo(servUserDetails);
                } else {
                    ShowToast("Error", response.error, null);
                }
            } catch (err) {
                ShowToast("Error - User Info", "Seems to be an error, please refresh the page", null);
            }
        }
        sendRequests();
    }, [session])

    const SelectUser = (UID: string) => {
        const specUI = uInfo?.find(x => x.User.UID === UID);
        const specAt = specUI?.Attendance?.Attendance;
        setAttInfo(specAt);
        setTargetUser(UID);
    }

    return (
        <div className={`autlist ${targetUser === null ? 'max' : 'min'}`}>
            <div className="authlist-left">
                <h2>User Information</h2>
                <div className={`cards ${targetUser === null ? 'fourprow' : 'threeprow'}`}>
                    {uInfo?.map((data, index) => (
                        <div className="cards-card" key={index} onClick={() => SelectUser(data.User.UID)}>
                            <div className="cards-card-img">
                                <div className="img-cont">
                                    <Image
                                        layout="fill"
                                        objectFit="cover"
                                        src={getImageLink(data.User.Image)}
                                        alt={data.User.Name}
                                    />
                                </div>
                            </div>
                            <div className="cards-card-details">
                                <ul>
                                    <li>{data.User.Name}</li>
                                    <li>{data.User.Role}</li>
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="authlist-right">
                <h2>Attendance Information</h2>
                <Calender data={fillAttendanceData(attInfo)} />
            </div>
        </div>
    );
};

export default AuthList;