'use client'
import "../../../css/actions/update/diary.scss"
import "../../../css/forms.scss"
import LoadingScreen from '@/app/components/LoadingScreen';
import Struct from '@/app/Struct';
import { getLast30Days, sendRequest } from "@/utils";
import React, { useEffect, useState } from 'react'
import { IDiaryInfo } from "@/schema/diaryinfo";
import { useSession } from "next-auth/react";
import { FaArrowLeft } from "react-icons/fa";
import { TeacherClass } from "@/interfaces";
import Button from "@/app/components/Button";
import { ShowToast } from "@/app/utilsjsx";

const Diary = () => {
    const [isLoadingCompleted, setIsLoadingCompleted] = useState(false);
    const [diaries, setDiaries] = useState<IDiaryInfo[]>([]);
    const [targetDiary, setTargetDiary] = useState<IDiaryInfo | undefined>(undefined);
    const [isDisabled, setIsDisabled] = useState(true);
    const [TeacherDetails, setTeacherDetails] = useState<TeacherClass[]>([]);
    const [lastTDate, setLastTDate] = useState("");

    const { data: session } = useSession();

    const dayChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
        getDiaries(e.target.value);
    }

    const getDiaries = async (tDate: string) => {
        setTargetDiary(undefined);
        setLastTDate(tDate);
        const response = await sendRequest('/api/posts', {
            Request: 'getdiaries',
            tDate: tDate,
            SchoolName: session?.user.schoolName,
            Caster: session?.user.role
        });
        if (response.message === "OK") {
            setDiaries(response.results.docs);
        }
    }

    useEffect(() => {
        const getInfo = async () => {
            const response = await sendRequest('/api/posts', {
                Request: "teacherswithclasses",
                SchoolName: session?.user.schoolName
            });
            if (response.message === "OK") {
                setIsDisabled(false);
                setTeacherDetails(response.results.docs);
            }
        }
        if (session)
            getInfo();
    }, [session]);

    const postDiary = async () => {
        const response = await sendRequest('/api/posts', {
            Request: "postdiary",
            Caster: session?.user.role,
            SchoolName: session?.user.schoolName,
            tDate: targetDiary?.DiaryFor,
            Authorizer: session?.user.name,
            Class: targetDiary?.ClassName
        });
        if (response.message === "OK") {
            getDiaries(lastTDate);
            ShowToast("Diary", "Diary has been posted", null);
        } else {
            ShowToast("Diary", response.error, null);
        }
    }

    return (
        <Struct LoadingCompleted={setIsLoadingCompleted}>
            <LoadingScreen IsLoadingCompleted={isLoadingCompleted}>
                <h1>Diaries</h1>
                <small>Post diaries to be shown to <b>Sudents & Parents</b></small>
                <div className="forms">
                    <select name="Date" id="Date" onChange={dayChanged} disabled={isDisabled}>
                        <option value="">Select Date</option>
                        {getLast30Days().map((day, index) => (
                            <option value={day.Date} key={index}>{day.Value}</option>
                        ))}
                    </select>
                    <label htmlFor="Date">Date</label>
                </div>
                <div className="diary">
                    {targetDiary === undefined ?
                        <div className="diary-classes ov">
                            {diaries.map((diary, index) => (
                                <div
                                    className={`diary-classes-class ov-body ${diary.IsAuthorized ? 'authorized' : ''}`}
                                    key={index}
                                    onClick={() => setTargetDiary(diary)}>
                                    <div className="ov-mock"></div>
                                    <div className="ov-body-in">
                                        <div className="diary-classes-class-details"><h2>{diary.ClassName}</h2></div>
                                        <div className="diary-classes-class-details">{diary.Diaries.length} {diary.Diaries.length > 1 ? "Diaries" : "Diary"}</div>
                                        <div className="diary-classes-class-details">Class Teacher: {TeacherDetails.find(x => x.Class === diary.ClassName)?.TeacherName}</div>
                                        <div className="diary-classes-class-details">Status: {diary.IsAuthorized ? "Posted" : "Unposted"}</div>
                                        <div className="diary-classes-class-details">View Diaries</div>
                                    </div>
                                </div>
                            ))}
                        </div> :
                        <div className="diary-view">
                            <div className="navback">
                                <span className='link' onClick={() => setTargetDiary(undefined)}><FaArrowLeft className='navback-icon' />Go Back</span>
                            </div>
                            <h2>{targetDiary.ClassName}</h2>
                            <div className="diary-view-teacher">Teacher: {TeacherDetails.find(x => x.Class === targetDiary.ClassName)?.TeacherName}</div>
                            {targetDiary.Diaries.map((diary) => (
                                <div className="diary-view-entry" key={diary.Subject}>
                                    <div className="diary-view-entry-in"><div><h3>{diary.Subject}</h3></div> <div>{TeacherDetails.find(x => x.Subject === diary.Subject)?.TeacherName}</div></div>
                                    <div className="diary-view-entry-in">{diary.Diary}</div>
                                </div>
                            ))}
                            {!targetDiary.IsAuthorized &&
                                <div className="button">
                                    <Button onClick={postDiary} SingleUse={true}>Post</Button>
                                </div>
                            }
                        </div>
                    }
                </div>
            </LoadingScreen>
        </Struct>
    )
}

export default Diary