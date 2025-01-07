import React from 'react'
import './css/home.scss'
import Link from 'next/link'
import Footer from './sections/footer'

const Home = () => {
  return (
    <main>
      <div className="hero">
        <h1>Studify</h1>
        <p>Stay connected to your child&apos;s academic journey with real-time updates. Empower their success with instant access to grades, attendance, and progress.</p>
      </div>
      <div className="cards">
        <div className="cards-cont">
          <h1>Title</h1>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur necessitatibus omnis saepe. Doloribus ad, nihil sequi dolores soluta odit amet, ipsa iste placeat, assumenda adipisci perspiciatis voluptates quam dolorem possimus!</p>
          <h3>Features</h3>
          <ul>
            <li>One</li>
            <li>Two</li>
            <li>Three</li>
            <li>Four</li>
          </ul>
          <div className="cards-cont-cta">
            <Link href={'#'} className='cta bg'>Login</Link>
          </div>
        </div>
        <div className="cards-cont">
          <h1>Title</h1>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur necessitatibus omnis saepe. Doloribus ad, nihil sequi dolores soluta odit amet, ipsa iste placeat, assumenda adipisci perspiciatis voluptates quam dolorem possimus!</p>
          <h3>Features</h3>
          <ul>
            <li>One</li>
            <li>Two</li>
            <li>Three</li>
            <li>Four</li>
          </ul>
          <div className="cards-cont-cta">
            <Link href={'#'} className='cta bg'>Login</Link>
          </div>
        </div>
        <div className="cards-cont">
          <h1>Title</h1>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur necessitatibus omnis saepe. Doloribus ad, nihil sequi dolores soluta odit amet, ipsa iste placeat, assumenda adipisci perspiciatis voluptates quam dolorem possimus!</p>
          <h3>Features</h3>
          <ul>
            <li>One</li>
            <li>Two</li>
            <li>Three</li>
            <li>Four</li>
          </ul>
          <div className="cards-cont-cta">
            <Link href={'#'} className='cta bg'>Login</Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

export default Home