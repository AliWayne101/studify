'use client'
import "../../css/diary.scss";
import "../../css/actions/create/class.scss";
import DiaryComponent from "@/app/sections/DiaryComponent";
import LoadingScreen from '@/app/components/LoadingScreen';
import Struct from '@/app/Struct';
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from 'react'
import { UserDiary } from "@/interfaces";
import { sendRequest } from "@/utils";
import { FaArrowLeft } from "react-icons/fa";

const Diary = () => {
  const [isLoadingCompleted, setIsLoadingCompleted] = useState(false);
  const [diaries, setDiaries] = useState<UserDiary[]>([]);
  const [targetDiary, setTargetDiary] = useState<UserDiary | undefined>(undefined);
  const { data: session } = useSession();

  const loadDiaries = async () => {
    setIsLoadingCompleted(false);
    var requestData = {
      Request: "loaddiaries",
      UID: session?.user.uid,
      Role: session?.user.role,
    }
    const response = await sendRequest('/api/posts', requestData);
    if (response.message === "OK") {
      if (session?.user.role === "Parent")
        setDiaries(response.results.docs);
      else
        setTargetDiary(response.results.docs[0]);
    }
    setIsLoadingCompleted(true);
  }

  useEffect(() => {
    if (session)
      loadDiaries();
  }, [session]);


  return (
    <Struct LoadingCompleted={setIsLoadingCompleted}>
      <LoadingScreen IsLoadingCompleted={isLoadingCompleted}>
        {
          targetDiary === undefined &&
          session?.user.role === "Parent" &&
          <div className="class">
            <h2>Children List</h2>
            <p>View diary sorted by your child&apos;s class.</p>
            <div className="class-assign">
              <div className="class-assign-list">
                <ul>
                  {diaries.map((diary, index) => (
                    <li
                      key={index}
                      onClick={() => setTargetDiary(diary)}
                    >{diary.User.Name} <small>{diary.Diary?.ClassName}</small></li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        }
        {
          session?.user.role === "Parent" &&
          targetDiary !== undefined &&
          <div className="navback">
            <span className='link' onClick={() => setTargetDiary(undefined)}><FaArrowLeft className='navback-icon' />Go Back</span>
          </div>
        }
        <DiaryComponent data={targetDiary} />
      </LoadingScreen>
    </Struct>
  )
}

export default Diary