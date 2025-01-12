"use client"
import React, { useEffect, useState } from 'react'
import Logo from '../sections/Logo'
import Body from '../sections/Body'
import Footer from '../sections/footer'
import "../css/dashboard.scss"
import StudentList from '../sections/StudentList'
import { IStudentCard } from '@/schema/studentcard'
import { useSession } from 'next-auth/react'
import Navbar from '../sections/Navbar'
import Basic from '../sections/Owner/Basic'
import Loading from '../components/Loading'

const Dashboard = () => {
  const { data: session, status } = useSession();
  const [studentlist, setStudentlist] = useState<IStudentCard[]>([]);

  useEffect(() => {
    console.log(session);
  }, [session]);

  return (
    <>
      <Navbar />
      <main>
        <Logo />
        <Body>
          {session ? (
            <div className="dash">
              <div className="dash-intro">
                <h1>Hi, {session?.user.name}</h1>
                <small>{session?.user.role} of {session?.user.schoolName}</small>
              </div>
              <Basic Role={session.user.role} />
              <StudentList students={studentlist} />
            </div>
          ) : <Loading />}

        </Body>
      </main>
      <Footer />
    </>
  )
}

export default Dashboard