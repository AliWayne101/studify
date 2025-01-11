"use client"
import React, { useState } from 'react'
import Logo from '../sections/Logo'
import Body from '../sections/Body'
import Footer from '../sections/footer'
import "../css/dashboard.scss"
import StudentList from '../sections/StudentList'
import { IStudentCard } from '@/schema/studentcard'
import { useSession } from 'next-auth/react'
import { SignOut } from '../auth'

const Dashboard = () => {
  const { data: session, status } = useSession();
  const [studentlist, setStudentlist] = useState<IStudentCard[]>([]);

  console.log(session);

  return (
    <>
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