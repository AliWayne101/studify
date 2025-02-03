"use client"
import React, { useEffect, useRef, useState } from 'react';
import { AttendanceStructProps, ProperUserInterface, SessionProps } from '@/interfaces';
import "../../css/sections/Authority/authlist.scss";
import Image from 'next/image';
import { fillAttendanceData, getImageLink, sendRequest } from '@/utils';
import Calender from '@/app/components/Calender';
import { ShowToast } from '@/app/utilsjsx';
import { motion } from 'framer-motion';
import { IUserInfo } from '@/schema/userinfo';
import Link from 'next/link';

const AuthList = ({ session }: SessionProps) => {
    const [uInfo, setUInfo] = useState<ProperUserInterface[] | undefined>(undefined);
    const [attInfo, setAttInfo] = useState<AttendanceStructProps[] | undefined>(undefined);
    const [targetUser, setTargetUser] = useState<IUserInfo | undefined>(undefined);
    const [isAllowed, setIsAllowed] = useState(true);

    const atRef = useRef<HTMLDivElement>(null);

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
        } else {
            setIsAllowed(false);
            return;
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
        setTargetUser(specUI?.User);
        if (atRef !== null && atRef.current !== null)
            atRef.current.scrollIntoView({ behavior: 'smooth' });
    }

    return (
        <>{
            isAllowed &&
            <div className={`autlist ${targetUser === undefined ? 'max' : 'min'}`}>
                <div className="authlist-left">
                    <h2>User Information</h2>
                    <small>View Basic information along with attendance</small>
                    <div className={`cards ${targetUser === undefined ? 'fourprow' : 'threeprow'}`}>
                        {uInfo?.map((data, index) => (
                            <Link href={`/user/${data.User.UID}`} key={index}>
                                <motion.div
                                    className={`cards-card ${targetUser?.UID === data.User.UID && 'selected'}`}
                                    custom={index}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.3, delay: 0.2 * index }}
                                    variants={{
                                        visible: { opacity: 1, scale: 1 },
                                        hidden: { opacity: 0, scale: 0 }
                                    }}
                                >
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
                                            <li><span>{data.User.Name}</span></li>
                                            <li>{data.User.Role}</li>
                                        </ul>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>
                {/* <div className="authlist-right" ref={atRef} id='attendance-ref'>
                    <h2>Attendance Information</h2>
                    <Calender data={fillAttendanceData(attInfo)} />
                    <div className="authlist-right-ui">
                        <h2>User Information</h2>
                        <ul>
                            <li>Email: <span>{targetUser?.Email}</span></li>
                            <li>Gender: <span>{targetUser?.Gender}</span></li>
                            <li>Phone: <span>{targetUser?.Phone}</span></li>
                            <li>CNIC: <span>{targetUser?.CNIC}</span></li>
                            <li>DOB: <span>{targetUser && (new Date(targetUser.DOB)).toLocaleDateString()}</span></li>
                            <li>DOJ: <span>{targetUser && (new Date(targetUser.JoinedOn)).toLocaleDateString()}</span></li>
                        </ul>
                    </div>
                </div> */}
            </div>
        }</>
    );
};

export default AuthList;