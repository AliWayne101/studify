'use client'
import "../../css/tests.scss"
import LoadingScreen from '@/app/components/LoadingScreen';
import Struct from '@/app/Struct';
import { ISubjectItem, ProperUserInterface } from "@/interfaces";
import { IMonthlyTestInfo } from "@/schema/monthlytestinfo";
import { sendRequest } from "@/utils";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from 'react'

const Tests = () => {
    const [isLoadingCompleted, setIsLoadingCompleted] = useState(false);
    const [properUser, setProperUser] = useState<ProperUserInterface | undefined>(undefined);
    const [userData, setUserData] = useState<IMonthlyTestInfo>();

    const { data: session } = useSession();

    const loadData = async (target: string) => {
        if (!session) return;
        const response = await sendRequest('/api/posts', {
            Request: "getmonthlytests",
            UID: session.user?.uid,
            Target: target
        });
        if (response.message === "OK")
            setUserData(response.results.doc);
    }

    const loadUser = async() => {
        const response = await sendRequest('/api/posts', {
            Request: "properuserdetail",
            UID: session?.user?.uid,
            SchoolName: session?.user.schoolName
        });
        if (response.message === "OK")
            setProperUser(response.results.doc);
    }

    useEffect(() => {
        if (session) {
            loadUser();
            loadData("monthly");
        }
    }, [session]);

    return (
        <Struct LoadingCompleted={setIsLoadingCompleted}>
            <LoadingScreen IsLoadingCompleted={isLoadingCompleted}>
                <div className="tests">
                    <div className="tests-menu">
                        <div className="tests-menu-item" onClick={() => loadData("daily")}>Daily</div>
                        <div className="tests-menu-item" onClick={() => loadData("weekly")}>Weekly</div>
                        <div className="tests-menu-item" onClick={() => loadData("monthly")}>Monthly</div>
                        <div className="tests-menu-item" onClick={console.log}>Date</div>
                    </div>
                    <div className="tests-card">
                        <div className="tests-card-in">
                            <div className="detail">
                                <span>Name</span>
                                <h1>{properUser?.User.Name}</h1>
                            </div>
                            <div className="detail">
                                <span>Class</span>
                                <h3>{properUser?.Class?.Name}</h3>
                            </div>
                            <div className="detail">
                                <span>Role</span>
                                <h3>{properUser?.User.Role}</h3>
                            </div>
                        </div>
                        <div className="tests-card-in">
                            <div className="subjects">
                                {userData?.Subjects && Object.entries(userData.Subjects).map(([subName, subDetails]) => (
                                    <div className="subjects-subject" key={subName}>
                                        <h2>{subName}</h2>
                                        <div className="subjects-subject-boxes">
                                            {subDetails.sort((a:ISubjectItem, b:ISubjectItem) => new Date(a.Date).getTime() - new Date(b.Date).getTime()).map((item: ISubjectItem) => (
                                                <div className="subjects-subject-boxes-box" key={new Date(item.Date).getTime() + item.ObtainedMarks}>
                                                    <div className="top">Position: {item.Position}</div>
                                                    <div className="inside"><span>{item.ObtainedMarks}</span><span>{item.TotalMarks}</span></div>
                                                    <div className="outside">{new Date(item.Date).toLocaleDateString()}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </LoadingScreen>
        </Struct>
    )
}

export default Tests