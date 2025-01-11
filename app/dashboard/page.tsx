import React from 'react'
import Logo from '../sections/Logo'
import Body from '../sections/Body'
import Footer from '../sections/footer'
import "../css/dashboard.scss"

const Dashboard = () => {
  return (
    <>
    <main>
        <Logo />
        <Body>
            This is body
        </Body>
    </main>
    <Footer />
    </>
  )
}

export default Dashboard