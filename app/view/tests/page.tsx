'use client'
import "../../css/tests.scss"
import LoadingScreen from '@/app/components/LoadingScreen';
import Struct from '@/app/Struct';
import React, { useState } from 'react'

const Tests = () => {
    const [isLoadingCompleted, setIsLoadingCompleted] = useState(false);
  return (
    <Struct LoadingCompleted={setIsLoadingCompleted}>
        <LoadingScreen IsLoadingCompleted={isLoadingCompleted}>
            <div className="tests">
                <div className="tests-menu">
                    <div className="tests-menu-item">Daily</div>
                    <div className="tests-menu-item">Weekly</div>
                    <div className="tests-menu-item">Monthly</div>
                    <div className="tests-menu-item">Date</div>
                </div>
                <div className="tests-card">
                    <div className="tests-card-in">Left </div>
                    <div className="tests-card-in">Right </div>
                </div>
            </div>
        </LoadingScreen>
    </Struct>
  )
}

export default Tests