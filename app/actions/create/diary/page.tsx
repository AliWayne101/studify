'use client'
import '../../../css/actions/create/diary.scss';
import "../../../css/actions/create/class.scss";
import React, { useEffect, useState } from 'react'
import Struct from '@/app/Struct';
import LoadingScreen from '@/app/components/LoadingScreen';
import { FaArrowLeft } from 'react-icons/fa';
import { IDiaryInfo } from '@/schema/diaryinfo';
import { sendRequest } from '@/utils';
import { useSession } from 'next-auth/react';
import { IClassInfo } from '@/schema/classinfo';
import { ShowToast } from '@/app/utilsjsx';

const Diary = () => {
    const [isLoadingCompleted, setIsLoadingCompleted] = useState(false);
    const [curWindow, setCurWindow] = useState("");
    const [targetDiary, setTargetDiary] = useState<IDiaryInfo | undefined>(undefined);
    const [classList, setClassList] = useState<IClassInfo[]>([]);
    const [targetClass, setTargetClass] = useState<IClassInfo | undefined>(undefined);

    const { data: session } = useSession();

    const LoadData = async () => {
        setIsLoadingCompleted(false);
        const response = await sendRequest('/api/posts', {
            Request: "getclass",
            SchoolName: session?.user.schoolName
        });
        if (response.message === "OK") {
            setClassList(response.results.docs);
        } else {
            ShowToast("Class List", response.error, null);
        }
        setIsLoadingCompleted(true);
    }

    useEffect(() => {
        if (session)
            LoadData();
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