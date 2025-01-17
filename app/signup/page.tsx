"use client"
import "../css/login.scss"
import React, { useState } from 'react'
import Button from '../components/Button'
import Footer from '../sections/footer'
import { hashPassword } from '@/utils'
import Logo from '../sections/Logo'
import Error from '../components/Error'
import Body from '../sections/Body'
import { useSession } from 'next-auth/react'
import { RolesWithAuthority } from '@/configs'

const Signup = () => {
  const { data: session } = useSession();
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
    Address: "",
    DateOfBirth: ""
  });
  const [fillError, setFillError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value
    });
  }

  const HandleSignup = async () => {
    const { Name, Email, Role, SchoolName, Gender, Password, Repassword, Phone, CNIC, Address, DateOfBirth } = userInfo;
    const emptyFields = Object.entries(userInfo).filter(([key, value]) => value === "").map(([key]) => key);

    var emptyFieldsString = "";
    if (emptyFields.length > 0) {
      emptyFields.forEach(field => emptyFieldsString += field + ", ");
      emptyFieldsString = emptyFieldsString.slice(0, -2); // Strip last 2 characters
      emptyFields.length > 1 ? setFillError(emptyFieldsString + " are required fields") : setFillError(emptyFieldsString + " is a required field");
      return;
    } else {
      setFillError(null);
    }

    if (Password !== Repassword) {
      setFillError("Passwords do not match");
      return;
    }

    const hashedPassword = hashPassword(Password);

    //start register
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Request: "signup",
          Name,
          Email,
          Role,
          SchoolName: session ? session.user.schoolName : SchoolName,
          Gender,
          Password: hashedPassword,
          Phone,
          CNIC,
          Address,
          DOB: DateOfBirth
        })
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
        <Logo />
        <Body>
          <Error error={fillError} />
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
                  {RolesWithAuthority.map((role, index) => (
                    <option className='bg' value={role.role} key={index}>{role.role}</option>
                  ))}
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
              {!session &&
                <div className="login-in">
                  <input onChange={handleChange} type="Text" name="SchoolName" id="SchoolName" />
                  <label htmlFor="SchoolName">School Name</label>
                </div>
              }
              <div className="login-in">
                <input onChange={handleChange} type="Text" name="SchoolName" id="SchoolName" />
                <label htmlFor="SchoolName">School Name</label>
              </div>
              <div className="login-in">
                <input onChange={handleChange} type="date" name="DateOfBirth" id="DateOfBirth" />
                <label htmlFor="DateOfBirth">Date of Birth</label>
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
        </Body>
      </main>
      <Footer />
    </>
  )
}

export default Signup