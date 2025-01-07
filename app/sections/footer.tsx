import React from 'react'
import "../css/sections/footer.scss";
import Link from 'next/link';
import { SocialIcon } from 'react-social-icons';
import { footerLinks, socialDetails } from '../../configs';

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-in">
        <h1>Links</h1>
        <ul>
          {footerLinks.map((x, index) => (
            <li key={index}>
              <Link href={x.url}>{x.text}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="footer-in">
        Copyright © 2023 Studify. All rights reserved.<br />
        Site Developed and Hosted by <Link href='https://waynedev.vercel.app' target='_blank'><b>Wayne Development</b></Link>
      </div>
      <div className="footer-in">
        <h1>Socials</h1>
        <ul className="socials">
          {socialDetails.map((x, index) => (
            <li className="socials-icon" key={index}>
              <SocialIcon url={x.url} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Footer