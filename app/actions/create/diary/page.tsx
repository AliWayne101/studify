'use client'
import '../../../css/actions/create/diary.scss';
import React, { useState } from 'react'
import Struct from '@/app/Struct';
import LoadingScreen from '@/app/components/LoadingScreen';

const Diary = () => {
    const [isLoadingCompleted, setIsLoadingCompleted] = useState(false);

    //Check if diary has been entered for tomorrow
    return (
        <Struct LoadingCompleted={setIsLoadingCompleted}>
            <LoadingScreen IsLoadingCompleted={isLoadingCompleted}>
                This is it
            </LoadingScreen>
        </Struct>
    )
}

export default Diary