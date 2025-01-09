"use client"
import { WebDetails } from '@/configs'
import React, { useState } from 'react'
import Button from '../components/Button'
import Footer from '../sections/footer'
import "../css/login.scss"
import "../css/sections/hero.scss"

const Signup = () => {
  const [userInfo, setUserInfo] = useState({
    Name: "",
    Email: "",
    Role: "",
    SchoolName: "",
    Gender: "",
    Password: "",
    Repassword: "",
    Phone: "",
    CNIC: "",
    Address: ""
  });
  const [fillError, setFillError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value
    });
  }

  const HandleSignup = async () => {
    const emptyFields = Object.entries(userInfo).filter(([key, value]) => value === "").map(([key]) => key);

    var emptyFieldsString = "";
    if (emptyFields.length > 0) {
      emptyFields.forEach(field => emptyFieldsString += field + ", ");
      emptyFieldsString = emptyFieldsString.slice(0, -2); // Strip last 2 characters
      emptyFields.length > 1 ? setFillError(emptyFieldsString + "are required fields") : setFillError(emptyFieldsString + "is a required field");
      return;
    } else {
      setFillError(null);
    }

    //start register
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userInfo)
      });

      if (!response.ok) {
        setFillError("Network response was not okay, please try again");
      }

      const data = await response.json();
      console.log('Success:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <>
      <main>
        <div className="hero">
          <h1>{WebDetails.webName}</h1>
          <p>{WebDetails.webMotto}</p>
        </div>

        <div className="body-cont">
          { fillError && <div className="error">{fillError}</div> }
          <div className="loginform">
            <div className="login">
              <div className="login-in">
                <input onChange={handleChange} type="text" name="Name" id="Name" />
                <label htmlFor="Name">Name</label>
              </div>
              <div className="login-in">
                <input onChange={handleChange} type="email" name="Email" id="Email" />
                <label htmlFor="Email">Email</label>
              </div>
              <div className="login-in">
                <select name="Role" id="Role" onChange={handleChange}>
                  <option className='bg' value="">Select Role</option>
                  <option className='bg' value="Teacher">Teacher</option>
                  <option className='bg' value="Teacher">Admin</option>
                  <option className='bg' value="Student">Student</option>
                  <option className='bg' value="Parent">Parent</option>
                </select>
                <label htmlFor="Role">Role</label>
              </div>
              <div className="login-in">
                <select name="Gender" id="Gender" onChange={handleChange}>
                  <option className='bg' value="">Select Gender</option>
                  <option className='bg' value="Male">Male</option>
                  <option className='bg' value="Female">Female</option>
                </select>
                <label htmlFor="Gender">Gender</label>
              </div>
              <div className="login-in">
                <input onChange={handleChange} type="Text" name="SchoolName" id="SchoolName" />
                <label htmlFor="SchoolName">School Name</label>
              </div>
              <div className="login-in">
                <input onChange={handleChange} type="password" name="Password" id="Password" />
                <label htmlFor="Password">Password</label>
              </div>
              <div className="login-in">
                <input onChange={handleChange} type="password" name="Repassword" id="Repassword" />
                <label htmlFor="Repassword">Repassword</label>
              </div>
              <div className="login-in">
                <input onChange={handleChange} type="text" name="Phone" id="Phone" />
                <label htmlFor="Phone">Phone</label>
              </div>
              <div className="login-in">
                <input onChange={handleChange} type="text" name="CNIC" id="CNIC" />
                <label htmlFor="CNIC">CNIC</label>
              </div>
              <div className="login-in">
                <input onChange={handleChange} type="text" name="Address" id="Address" />
                <label htmlFor="Address">Address</label>
              </div>
              <Button onClick={HandleSignup}>Signup</Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default Signup