'use client'
import '../../../css/actions/create/diary.scss';
import "../../../css/actions/create/class.scss";
import "../../../css/forms.scss";
import React, { useEffect, useState } from 'react'
import Struct from '@/app/Struct';
import LoadingScreen from '@/app/components/LoadingScreen';
import { IDiaryInfo } from '@/schema/diaryinfo';
import { sendRequest } from '@/utils';
import { useSession } from 'next-auth/react';
import { IClassInfo } from '@/schema/classinfo';
import { ShowToast } from '@/app/utilsjsx';
import Button from '@/app/components/Button';
import { ISubjectsInfo } from '@/schema/subjectsinfo';
import Loading from '@/app/components/Loading';

const Diary = () => {
    const [isLoadingCompleted, setIsLoadingCompleted] = useState(false);
    const [classList, setClassList] = useState<IClassInfo[]>([]);
    const [targetClass, setTargetClass] = useState<IClassInfo | undefined>(undefined);
    const [subInfo, setSubInfo] = useState<ISubjectsInfo | undefined>(undefined);
    const [diaries, setDiaries] = useState<IDiaryInfo[]>([]);
    const [allowWriting, setAllowWriting] = useState(false);
    const [isDiaryPosted, setIsDiaryPosted] = useState<boolean | undefined>(undefined);
    const [userSubject, setUserSubject] = useState("unassigned");
    const [currentDiary, setCurrentDiary] = useState("");
    const [disabledButton, setDisabledButton] = useState(false);

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

    const UploadDiary = async () => {
        setDisabledButton(true);
        const response = await sendRequest('/api/posts', {
            Request: "uploaddiary",
            SchoolName: session?.user.schoolName,
            Subject: userSubject,
            Diary: currentDiary,
            ClassName: targetClass?.Name
        });
        if (response.message === "OK") {
            LoadFullData();
            ShowToast("Diary", "Diary has been uploaded successfully", null);
        } else
            ShowToast("Diary", response.error, null);
        setDisabledButton(false);
    }

    const switchDiary = (item: IClassInfo) => {
        setTargetClass(item);
        if (subInfo && session) {
            const curDiary = diaries.find(x => x.ClassName === item.Name);
            setIsDiaryPosted(curDiary?.IsAuthorized);

            const existingDiary = curDiary?.Diaries.find(y => y.Subject === userSubject);
            if (existingDiary) {
                setCurrentDiary(existingDiary.Diary);
            } else
                setCurrentDiary("");
        }
    }

    useEffect(() => {
        if (session)
            LoadData();
    }, [session]);

    return (
        <Struct LoadingCompleted={setIsLoadingCompleted}>
            <LoadingScreen IsLoadingCompleted={isLoadingCompleted}>
                <div className="class">
                    <h2>Create Diaries</h2>
                    <p>Create diary of your subject for any specific class</p>
                    <div className="class-assign">
                        <div className="class-assign-list">
                            <h3>Class list</h3>
                            <ul>
                                {classList.map((item, index) => (
                                    <li
                                        key={index}
                                        onClick={() => switchDiary(item)}
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
                                            <input
                                                type="text"
                                                disabled={true}
                                                name="Class"
                                                id="Class"
                                                value={targetClass?.Name || ""}
                                            />
                                            <label htmlFor="Class">Class</label>
                                        </div>
                                        <div className="forms">
                                            <input
                                                type="text"
                                                disabled={true}
                                                name="Subject"
                                                id="Subject"
                                                value={userSubject}
                                            />
                                            <label htmlFor="Subject">Subject</label>
                                        </div>
                                        <div className="forms">
                                            <textarea
                                                onChange={(e) => setCurrentDiary(e.target.value)}
                                                disabled={isDiaryPosted !== undefined ? isDiaryPosted : false}
                                                name="Diary"
                                                id="Diary"
                                                rows={10}
                                                value={currentDiary}
                                            />
                                            <label htmlFor="Diary">Diary</label>
                                        </div>
                                        {!isDiaryPosted ?
                                            <Button onClick={UploadDiary} Disabled={disabledButton}>Save</Button>
                                            : <div>Diary has already been posted</div>
                                        }
                                    </> : <div>You are not assigned any subject yet, please contact your Administration Department</div>
                                }
                            </div>
                        </div>
                    </div>
                </div>

            </LoadingScreen>
        </Struct>
    )
}

export default Diary