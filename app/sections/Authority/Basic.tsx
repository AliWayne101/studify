"use client"
import React, { useEffect, useState } from 'react'
import "../../css/sections/Authority/basic.scss"
import { motion } from 'framer-motion';
import { TbActivityHeartbeat } from 'react-icons/tb';
import { BasicInfoProps, SessionProps } from '@/interfaces';
import { isAuthorized } from '@/utils';
import { boxVariants } from '@/configs';

const Basic = ({ session }: SessionProps) => {
    const [basicInfo, setBasicInfo] = useState<BasicInfoProps[] | undefined>(undefined);
    const [isError, setIsError] = useState<string | undefined>(undefined);

    useEffect(() => {
        const sendRequest = async() => {
            setIsError(undefined);
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Request: "basic",
                    Role: session?.user.role,
                    SchoolName: session?.user.schoolName,
                    uID: session?.user.uid
                })
            });
            
            if (!response.ok) {
                setIsError("Network response was not okay, please refresh the page");
                return;
            }
            const data = await response.json();
            if (data.message === "OK") {
                const basicData: BasicInfoProps[] = data.data;
                setBasicInfo(basicData);
            } else {
                setIsError(data.error);
            }
        }
        sendRequest();
    }, [session])

    return (
        isAuthorized(session?.user.role, ["SU", "HU", "SG"]) ? (
            <div className="basic">
                <h2>Basic Information</h2>
                { isError && <><div className="error">{isError}</div></>}
                <div className="basic-boxes">
                    {basicInfo?.map(({Title, Info}, index) => (
                        <motion.div
                            className="basic-boxes-box bg-sec hl-bg"
                            custom={index}
                            initial="hidden"
                            animate="visible"
                            variants={boxVariants}
                            key={index}
                        >
                            <div className="basic-boxes-box-in">
                                <div><TbActivityHeartbeat className='basic-bg-icon' /></div>
                                <div>{Title}</div>
                                <div>{Info}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        ) : null
    )
}

export default Basic