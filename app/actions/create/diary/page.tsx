'use client'
import '../../../css/actions/create/diary.scss';
import "../../../css/actions/create/class.scss";
import "../../../css/forms.scss";
import React, { useEffect, useState } from 'react'
import Struct from '@/app/Struct';
import LoadingScreen from '@/app/components/LoadingScreen';
import { FaArrowLeft } from 'react-icons/fa';
import { IDiaryInfo } from '@/schema/diaryinfo';
import { sendRequest } from '@/utils';
import { useSession } from 'next-auth/react';
import { IClassInfo } from '@/schema/classinfo';
import { ShowToast } from '@/app/utilsjsx';
import Button from '@/app/components/Button';
import { DiaryDetail } from '@/interfaces';
import { ISubjectsInfo } from '@/schema/subjectsinfo';

const Diary = () => {
    const [isLoadingCompleted, setIsLoadingCompleted] = useState(false);
    const [curWindow, setCurWindow] = useState("");
    const [classList, setClassList] = useState<IClassInfo[]>([]);
    const [targetClass, setTargetClass] = useState<IClassInfo | undefined>(undefined);
    const [targetDiary, setTargetDiary] = useState<DiaryDetail>({
        Subject: "unassigned",
        Diary: ""
    });
    const [subInfo, setSubInfo] = useState<ISubjectsInfo | undefined>(undefined);
    const [diaries, setDiaries] = useState<IDiaryInfo[]>([]);
    const [allowWriting, setAllowWriting] = useState(false);
    const [isDiaryPosted, setIsDiaryPosted] = useState<boolean | undefined>(undefined);
    const [userSubject, setUserSubject] = useState("unassigned");
    const [currentDiary, setCurrentDiary] = useState("");

    const { data: session } = useSession();

    const LoadFullData = async () => {
        const diaryresp = await sendRequest('/api/posts', {
            Request: "getdiary",
            SchoolName: session?.user.schoolName
        });
        if (diaryresp.message === "OK")
            setDiaries(diaryresp.results.docs);
        else
            ShowToast("Diaries", diaryresp.error, null);

    }

    const LoadData = async () => {
        const response = await sendRequest('/api/posts', {
            Request: "getclass",
            SchoolName: session?.user.schoolName
        });
        if (response.message === "OK") {
            setClassList(response.results.docs);
        } else {
            ShowToast("Class List", response.error, null);
        }

        const subresp = await sendRequest('/api/posts', {
            Request: "getclasses",
            SchoolName: session?.user.schoolName
        });
        if (subresp.message === "OK")
            setSubInfo(subresp.results.doc);
        else
            ShowToast("Diaries", subresp.error, null);

        const _subI: ISubjectsInfo | undefined = subresp.results.doc;
        if (session && _subI) {
            var subTeacher = _subI.SubjectList.find(a => a.SubjectTeacherUID === session.user.uid);
            if (subTeacher) {
                setUserSubject(subTeacher.SubjectName);
                setAllowWriting(true);
                LoadFullData();
            }
        }

    }

    //Under Development
    //OnChange in TextArea fill the diary and on save send the request, reload the data

    useEffect(() => {
        if (session) {
            LoadData();
        }
    }, [session]);

    //Check if diary has been entered for tomorrow
    return (
        <Struct LoadingCompleted={setIsLoadingCompleted}>
            <LoadingScreen IsLoadingCompleted={isLoadingCompleted}>
                {curWindow === "create" ?
                    <div className="class">
                        <div className="navback">
                            <span className='link' onClick={() => setCurWindow("")}><FaArrowLeft className='navback-icon' />Go Back</span>
                        </div>
                        <h2>Create Diaries</h2>
                        <p>Create diary of your subject for any specific class</p>
                        <div className="class-assign">
                            <div className="class-assign-list">
                                <h3>Class list</h3>
                                <ul>
                                    {classList.map((item, index) => (
                                        <li
                                            key={index}
                                            onClick={() => {
                                                setTargetClass(item);
                                                if (subInfo && session) {
                                                    const curDiary = diaries.find(x => x.ClassName === item.Name);
                                                    setIsDiaryPosted(curDiary?.IsAuthorized);
                                                    var subTeacher = subInfo.SubjectList.find(a => a.SubjectTeacherUID === session.user.uid);
                                                    const existingDiary = curDiary?.Diaries.find(y => y.Subject === subTeacher?.SubjectName);
                                                    if (existingDiary) {
                                                        setTargetDiary({
                                                            Diary: existingDiary.Diary,
                                                            Subject: existingDiary.Subject
                                                        });
                                                    }
                                                }
                                            }}
                                            className={`${targetClass === item ? "border" : ""}`}
                                        >{item.Name}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className={`class-assign-info ${targetClass ? 'show' : 'hidden'}`}>
                                <div className="class-assign-info-in">
                                    <h3>Diary Details</h3>
                                    {
                                        allowWriting ? <>
                                            <div className="forms">
                                                <input type="text" disabled={true} name="Class" id="Class" value={targetClass?.Name} />
                                                <label htmlFor="Class">Class</label>
                                            </div>
                                            <div className="forms">
                                                <input type="text" disabled={true} name="Subject" id="Subject" value={userSubject} />
                                                <label htmlFor="Subject">Subject</label>
                                            </div>
                                            <div className="forms">
                                                <textarea disabled={isDiaryPosted !== undefined ? isDiaryPosted : false} name="Diary" id="Diary" rows={10} value={targetDiary.Diary} />
                                                <label htmlFor="Diary">Diary</label>
                                            </div>
                                            <Button onClick={console.log} Disabled={isDiaryPosted !== undefined ? isDiaryPosted : false}>Save</Button>
                                        </> : <div>You are not assigned any subject yet, please contact your Administration Department</div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    : curWindow === "view" ?
                        <div className="class">
                            <div className="navback">
                                <span className='link' onClick={() => setCurWindow("")}><FaArrowLeft className='navback-icon' />Go Back</span>
                            </div>
                            <h2>View Diary</h2>
                            <p>Recap diaries of all classes</p>
                            <div className="class-assign">
                                <div className="class-assign-list">
                                    <h3>Subject list</h3>
                                    <ul>
                                        {classList.map((item, index) => (
                                            <li
                                                key={index}
                                                onClick={() => setTargetClass(item)}
                                                className={`${targetClass === item ? "border" : ""}`}
                                            >{item.Name}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="class-assign-info">
                                    {targetDiary !== undefined &&
                                        <div className="class-assign-info-in">
                                            <h3>Diary Details</h3>
                                            Show Diary
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                        :
                        <div className='options'>
                            <div className="options-option" onClick={() => setCurWindow("create")}>
                                <div className="options-option-mock"></div>
                                <div className="options-option-main">
                                    <h1>Create</h1>
                                    <p>Create a new Diaries for all the classes</p>
                                </div>
                            </div>

                            <div className="options-option" onClick={() => setCurWindow("view")}>
                                <div className="options-option-mock"></div>
                                <div className="options-option-main">
                                    <h1>View</h1>
                                    <p>View Diary of any specific class</p>
                                </div>
                            </div>
                        </div>
                }
            </LoadingScreen>
        </Struct>
    )
}

export default Diary