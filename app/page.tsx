import React from 'react'
import './css/home.scss'
import { RiTeamFill } from 'react-icons/ri'
import { GiTeacher } from 'react-icons/gi'
import { PiStudentFill } from 'react-icons/pi'
import Struct from './Struct'

const Home = () => {
  return (
    <Struct>
      <div className="cards">
        <div className="cards-cont">
          <h2>Owner</h2>
          <p>As an owner, you can manage your institution efficiently with our comprehensive tools.</p>
          <h3>Features</h3>
          <div className="cards-cont-bottoms">
            <ul>
              <li>Institution Management</li>
              <li>Financial Tracking</li>
              <li>Performance Analytics</li>
              <li>Customizable Reports</li>
            </ul>
            <RiTeamFill className='cards-cont-bottoms-icon' />
          </div>
        </div>
        <div className="cards-cont">
          <h2>Teacher</h2>
          <p>As a teacher, you can enhance your teaching experience with our innovative tools.</p>
          <h3>Features</h3>
          <div className="cards-cont-bottoms">
            <ul>
              <li>Lesson Planning</li>
              <li>Student Progress Tracking</li>
              <li>Interactive Content</li>
              <li>Communication Tools</li>
            </ul>
            <GiTeacher className='cards-cont-bottoms-icon' />
          </div>
        </div>
        <div className="cards-cont">
          <h2>Student</h2>
          <p>As a student, you can maximize your learning potential with our engaging resources.</p>
          <h3>Features</h3>
          <div className="cards-cont-bottoms">
            <ul>
              <li>Personalized Learning</li>
              <li>Progress Tracking</li>
              <li>Interactive Lessons</li>
              <li>Support Resources</li>
            </ul>
            <PiStudentFill className='cards-cont-bottoms-icon' />
          </div>
        </div>
      </div>
    </Struct>
  )
}

export default Home