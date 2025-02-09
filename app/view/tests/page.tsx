'use client'
import Calendar from "@/app/components/Calender";
import "../../css/tests.scss"
import "../../css/forms.scss"
import LoadingScreen from '@/app/components/LoadingScreen';
import Struct from '@/app/Struct';
import { AttendanceStructProps, ISubjectItem, ProperUserInterface } from "@/interfaces";
import { IMonthlyTestInfo } from "@/schema/monthlytestinfo";
import { fillAttendanceData, monthIndices, MonthNames, sendRequest } from "@/utils";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from 'react'
import { FaArrowLeft } from "react-icons/fa";

const Tests = () => {
    const [isLoadingCompleted, setIsLoadingCompleted] = useState(false);
    const [properUser, setProperUser] = useState<ProperUserInterface | undefined>(undefined);
    const [userData, setUserData] = useState<IMonthlyTestInfo | null>(null);
    const [calData, setCalData] = useState<AttendanceStructProps[]>([]);
    const [callerDisabled, setCallerDisabled] = useState(false);
    const [monthYear, setMonthYear] = useState({
        Month: new Date().toLocaleString('default', { month: 'long' }),
        Year: new Date().getFullYear()
    });
    const [targetDay, setTargetDay] = useState(0);

    const { data: session } = useSession();

    const loadData = async (tarMonth: string) => {
        if (!session) return;
        setCallerDisabled(true);
        const response = await sendRequest('/api/posts', {
            Request: "getmonthlytests",
            UID: session.user?.uid,
            Target: tarMonth,
        });
        setCallerDisabled(false);
        if (response.message === "OK") {
            const _data: IMonthlyTestInfo | null = response.results.doc;
            if (!_data) {
                setCalData([]);
                setUserData(null);
                return;
            }
            const newCalData: AttendanceStructProps[] = [];
            Object.entries(_data.Subjects).forEach(([subName, subDetails]) => {
                const _subD: ISubjectItem[] = subDetails;
                for (const _detail of _subD) {
                    const ifExists = newCalData.find((a) => a.Day === new Date(_detail.Date).getDate());
                    if (!ifExists)
                        newCalData.push({ Day: new Date(_detail.Date).getDate(), Status: "filled" });

                    setMonthYear({
                        Month: new Date(_detail.Date).toLocaleString('default', { month: 'long' }),
                        Year: new Date(_detail.Date).getFullYear()
                    });
                }
            });
            setCalData(newCalData);
            setUserData(_data);
        }
    }

    const loadUser = async () => {
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
            const curDate = new Date();
            curDate.setMonth(curDate.getMonth() - 1);
            loadData(curDate.toLocaleString('default', { month: 'long' }));
        }
    }, [session]);

    return (
        <Struct LoadingCompleted={setIsLoadingCompleted}>
            <LoadingScreen IsLoadingCompleted={isLoadingCompleted}>
                <div className="tests">
                    <div className="tests-date">
                        <h2>Month</h2>
                        <span>Show results for the selected date</span>
                        <div className="forms">
                            <select name="text" id="Month"
                                defaultValue={new Date(new Date().setMonth(new Date().getMonth() - 1)).toLocaleString('default', { month: 'long' })}
                                onChange={(e) => loadData(e.target.value)}
                                disabled={callerDisabled}
                            >
                                <option value="January">January</option>
                                <option value="February">February</option>
                                <option value="March">March</option>
                                <option value="April">April</option>
                                <option value="May">May</option>
                                <option value="June">June</option>
                                <option value="July">July</option>
                                <option value="August">August</option>
                                <option value="September">September</option>
                                <option value="October">October</option>
                                <option value="November">November</option>
                                <option value="December">December</option>
                            </select>
                            <label htmlFor="Date">Month</label>
                        </div>
                    </div>
                </div>
                <div className="tests-menu">
                    {/* Create buttons to summaries the data */}
                    <div className="tests-menu-item" onClick={() => loadData("")}>Daily</div>
                    <div className="tests-menu-item" onClick={() => loadData("")}>Weekly</div>
                    <div className="tests-menu-item" onClick={() => loadData("")}>Monthly</div>
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
                        {
                            targetDay === 0 ?
                                <>
                                <h2 className="center">Date</h2>
                                <span className="center">Date-wise selection of test day</span>
                                    <Calendar
                                        data={fillAttendanceData(calData, monthYear.Month, monthYear.Year)}
                                        handleClick={(e) => setTargetDay(e)}
                                        firstDayOfMonth={new Date(monthYear.Year, monthIndices[monthYear.Month as MonthNames], 1).getDay()}
                                    />
                                </>
                                :
                                <>
                                    <div className="navback">
                                        <span className='link' onClick={() => setTargetDay(0)}><FaArrowLeft className='navback-icon' />Go Back</span>
                                    </div>
                                    <div className="subjects">
                                        {userData?.Subjects && Object.entries(userData.Subjects).map(([subName, subDetails]) => (
                                            <div className="subjects-subject" key={subName}>
                                                <h2>{subName}</h2>
                                                <div className="subjects-subject-boxes">
                                                    {subDetails.filter((a: ISubjectItem) => new Date(a.Date).getDate() === targetDay).map((item: ISubjectItem) => (
                                                        <div className="subjects-subject-boxes-box" key={new Date(item.Date).getTime() + item.ObtainedMarks}>
                                                            <div className="top">Position: {item.Position}</div>
                                                            <div className="inside"><span>{item.ObtainedMarks}</span><span>{item.TotalMarks}</span></div>
                                                            <div className="outside">{new Date(item.Date).toLocaleDateString()}</div>
                                                        </div>
                                                    ))}
                                                    {/* {subDetails.sort((a: ISubjectItem, b: ISubjectItem) => new Date(a.Date).getTime() - new Date(b.Date).getTime()).map((item: ISubjectItem) => (
                                                        <div className="subjects-subject-boxes-box" key={new Date(item.Date).getTime() + item.ObtainedMarks}>
                                                            <div className="top">Position: {item.Position}</div>
                                                            <div className="inside"><span>{item.ObtainedMarks}</span><span>{item.TotalMarks}</span></div>
                                                            <div className="outside">{new Date(item.Date).toLocaleDateString()}</div>
                                                        </div>
                                                    ))} */}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>

                        }
                    </div>
                </div>
            </LoadingScreen>
        </Struct >
    )
}

export default Tests