import React, { useState } from 'react'
import Logo from '../sections/Logo'
import Body from '../sections/Body'
import Footer from '../sections/footer'
import "../css/dashboard.scss"
import StudentList from '../sections/StudentList'
import { IStudentCard } from '@/schema/studentcard'

const Dashboard = () => {
  const [studentlist, setStudentlist] = useState<IStudentCard[]>([]);
  return (
    <>
    <main>
        <Logo />
        <Body>
            <StudentList students={studentlist} />
        </Body>
    </main>
    <Footer />
    </>
  )
}

export default Dashboard