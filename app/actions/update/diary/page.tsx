'use client'
import "../../../css/actions/update/diary.scss"
import LoadingScreen from '@/app/components/LoadingScreen';
import Struct from '@/app/Struct';
import React, { useState } from 'react'

const Diary = () => {
    const [isLoadingCompleted, setIsLoadingCompleted] = useState(false);
    return (
        <Struct LoadingCompleted={setIsLoadingCompleted}>
            <LoadingScreen IsLoadingCompleted={isLoadingCompleted}>
                <h1>Diaries</h1>
                <small>Post diaries to be shown to <b>Sudents & Parents</b></small>

            </LoadingScreen>
        </Struct>
    )
}

export default Diary