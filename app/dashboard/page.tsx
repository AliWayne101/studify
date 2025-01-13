"use client"
import React, { useEffect, useState } from 'react'
import Logo from '../sections/Logo'
import Body from '../sections/Body'
import Footer from '../sections/footer'
import "../css/dashboard.scss"
import StudentList from '../sections/Authority/StudentList'
import { IStudentCard } from '@/schema/studentcard'
import { useSession } from 'next-auth/react'
import Navbar from '../sections/Navbar'
import Basic from '../sections/Authority/Basic'
import Loading from '../components/Loading'

const Dashboard = () => {
  const { data: session, status } = useSession();
  const [studentlist, setStudentlist] = useState<IStudentCard[]>([]);
  const [addBlur, setAddBlur] = useState(false);

  return (
    <>
      <Navbar updateParentState={setAddBlur} />
      <main className={`${addBlur && 'blur'}`}>
        <Logo />
        <Body>
          {session ? (
            <div className="dash">
              <div className="dash-intro">
                <h1>Hi, {session?.user.name}</h1>
                <small><span>{session?.user.role}</span> of <b>{session?.user.schoolName}</b></small>
              </div>
              <Basic Role={session.user.role} />
              <StudentList Role={session.user.role} />
            </div>
          ) : <Loading Size={48} />}

        </Body>
      </main>
      <div className={`${addBlur && 'blur'}`}>
        <Footer />
      </div>
    </>
  )
}

export default Dashboard