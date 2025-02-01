'use client'
import "../../css/diary.scss";
import LoadingScreen from '@/app/components/LoadingScreen';
import Struct from '@/app/Struct';
import React, { useState } from 'react'

const Diary = () => {
    const [isLoadingCompleted, setIsLoadingCompleted] = useState(false);
  return (
    <Struct LoadingCompleted={setIsLoadingCompleted}>
        <LoadingScreen IsLoadingCompleted={isLoadingCompleted}>
            This is it
        </LoadingScreen>
    </Struct>
  )
}

export default Diary