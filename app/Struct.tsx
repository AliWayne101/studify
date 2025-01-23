"use client"
import { StructProps } from '@/interfaces'
import React, { useState } from 'react'
import Navbar from './sections/Navbar'
import Logo from './sections/Logo'
import Body from './sections/Body'
import Footer from './sections/footer'

const Struct: React.FC<StructProps> = ({ children, LoadingCompleted }) => {
    const [addBlur, setAddBlur] = useState(false);
    return (
        <>
            <Navbar updateParentState={setAddBlur} LoadingCompleted={LoadingCompleted}/>
            <main className={`${addBlur && "blur"}`}>
                <Logo />
                <Body>
                    {children}
                </Body>
            </main>
            <div className={`${addBlur && 'blur'}`}>
                <Footer />
            </div>
        </>
    )
}

export default Struct