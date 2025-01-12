import React from 'react'
import './css/home.scss'
import Link from 'next/link'
import Footer from './sections/footer'
import Logo from './sections/Logo';
import Navbar from './sections/Navbar';

const Home = () => {
  return (
    <>
      <Navbar />
      <main>
        <Logo />
        <div className="cards">
          <div className="cards-cont">
            <h2>Owner</h2>
            <p>As an owner, you can manage your institution efficiently with our comprehensive tools.</p>
            <h3>Features</h3>
            <ul>
              <li>Institution Management</li>
              <li>Financial Tracking</li>
              <li>Performance Analytics</li>
              <li>Customizable Reports</li>
            </ul>
            <div className="cards-cont-cta">
              <Link href={'/login'} className='cta bg'>Login</Link>
            </div>
          </div>
          <div className="cards-cont">
            <h2>Teacher</h2>
            <p>As a teacher, you can enhance your teaching experience with our innovative tools.</p>
            <h3>Features</h3>
            <ul>
              <li>Lesson Planning</li>
              <li>Student Progress Tracking</li>
              <li>Interactive Content</li>
              <li>Communication Tools</li>
            </ul>
            <div className="cards-cont-cta">
              <Link href={'/login'} className='cta bg'>Login</Link>
            </div>
          </div>
          <div className="cards-cont">
            <h2>Student</h2>
            <p>As a student, you can maximize your learning potential with our engaging resources.</p>
            <h3>Features</h3>
            <ul>
              <li>Personalized Learning</li>
              <li>Progress Tracking</li>
              <li>Interactive Lessons</li>
              <li>Support Resources</li>
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