"use client"
import React, { useEffect, useState } from 'react'
import Logo from '../sections/Logo'
import Body from '../sections/Body'
import Footer from '../sections/footer'
import "../css/dashboard.scss"
import StudentList from '../sections/StudentList'
import { IStudentCard } from '@/schema/studentcard'
import { useSession } from 'next-auth/react'
import { SignOut } from '../auth'
import Navbar from '../sections/Navbar'

const Dashboard = () => {
  const { data: session, status } = useSession();
  const [studentlist, setStudentlist] = useState<IStudentCard[]>([]);

  useEffect(() => {
    console.log(session);
  },[session]);

  return (
    <>
    <Navbar />
    <main>
        <Logo />
        <Body>
        <div onClick={SignOut}>Signout</div>
            <StudentList students={studentlist} />
        </Body>
    </main>
    <Footer />
    </>
  )
}

export default Dashboard