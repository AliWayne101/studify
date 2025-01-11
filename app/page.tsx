import React from 'react'
import './css/home.scss'
import Link from 'next/link'
import Footer from './sections/footer'
import Logo from './sections/Logo';

const Home = () => {
  return (
    <>
      <main>
        <Logo />
        <div className="cards">
          <div className="cards-cont">
            <h2>Title</h2>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur necessitatibus omnis saepe. Doloribus ad, nihil sequi dolores soluta odit amet, ipsa iste placeat, assumenda adipisci perspiciatis voluptates quam dolorem possimus!</p>
            <h3>Features</h3>
            <ul>
              <li>One</li>
              <li>Two</li>
              <li>Three</li>
              <li>Four</li>
            </ul>
            <div className="cards-cont-cta">
              <Link href={'/login'} className='cta bg'>Login</Link>
            </div>
          </div>
          <div className="cards-cont">
            <h2>Title</h2>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur necessitatibus omnis saepe. Doloribus ad, nihil sequi dolores soluta odit amet, ipsa iste placeat, assumenda adipisci perspiciatis voluptates quam dolorem possimus!</p>
            <h3>Features</h3>
            <ul>
              <li>One</li>
              <li>Two</li>
              <li>Three</li>
              <li>Four</li>
            </ul>
            <div className="cards-cont-cta">
              <Link href={'/login'} className='cta bg'>Login</Link>
            </div>
          </div>
          <div className="cards-cont">
            <h2>Title</h2>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur necessitatibus omnis saepe. Doloribus ad, nihil sequi dolores soluta odit amet, ipsa iste placeat, assumenda adipisci perspiciatis voluptates quam dolorem possimus!</p>
            <h3>Features</h3>
            <ul>
              <li>One</li>
              <li>Two</li>
              <li>Three</li>
              <li>Four</li>
            </ul>
            <div className="cards-cont-cta">
              <Link href={'/login'} className='cta bg'>Login</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default Home