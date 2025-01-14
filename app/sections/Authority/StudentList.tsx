"use client"
import React, { useEffect, useState } from 'react';
import "../../css/sections/Authority/basic.scss";
import { SessionProps } from '@/interfaces';
import { isAuthorized } from '@/utils';
import List from './List';

const StudentList = ({ session }: SessionProps) => {
    const [isError, setIsError] = useState<string | null>(null);

    useEffect(() => {
        var requestBody = {
            Request: "getdashboarduinfo",
            uid: session.user.uid,
            targetRoll: "Student",
            schoolName: session.user.schoolName,
            clause: "all"
        };

        if (session.user.role === "Owner" || session.user.role === "Admin")
            requestBody.targetRoll = "Employees";
        else if (session.user.role === "Teacher")
            requestBody.clause = "class";

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
                const data = response.json();
                console.log(data);
            } catch (err) {
                setIsError("Seems to be an error, please refresh the page");
                console.log(err);
            }
        }
        sendRequest();
    }, [session.user.role])

    return (
        isAuthorized(session.user.role, ["SU", "HU"]) ? (
            <List Title="User Information" />
        ) : null
    );
};

export default StudentList;