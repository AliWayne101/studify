import React from 'react'
import "../css/sections/footer.scss";
import Link from 'next/link';

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-in">
        <h1>Links</h1>
        <ul>
          <li><Link href={'#'}>Link 1</Link></li>
          <li><Link href={'#'}>Link 2</Link></li>
          <li><Link href={'#'}>Link 3</Link></li>
          <li><Link href={'#'}>Link 4</Link></li>
          <li><Link href={'#'}>Link 5</Link></li>
        </ul>
      </div>
      <div className="footer-in">
        Copyright © 2023 Studify. All rights reserved.<br />
        Site Developed and Hosted by <Link href='https://waynedev.vercel.app' target='_blank'><b>Wayne Development</b></Link>
      </div>
      <div className="footer-in">
        <h1>Socials</h1>
      </div>
    </div>
  )
}

export default Footer