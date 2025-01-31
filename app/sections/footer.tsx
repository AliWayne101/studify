import React from 'react'
import "../css/sections/footer.scss";
import Link from 'next/link';
import { footerLinksMore, footerLinksAbout, WebDetails, socialDetails } from '../../configs';

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-section">
        <h1>{WebDetails.webName}</h1>
        <p>Unified Academic Resource Platform</p>
        <div className="footer-section-socials">
          {socialDetails.map((social, index) => (
            <Link href={social.url} target='_blank' key={index}>{social.icon}</Link>
          ))}
        </div>
        <div className="footer-section-copy">
          Copyright © 2023 {WebDetails.webName}. All rights reserved.<br />
          A project of <Link href={WebDetails.backlink}>Wayne Development</Link>
        </div>
      </div>
      <div className="footer-section">
        <h2>More Studify</h2>
        <ul>
          {footerLinksMore.map((link, index) => (
            <li key={index}><Link href={link.url}>{link.text}</Link></li>
          ))}
        </ul>
      </div>
      <div className="footer-section">
        <h2>About Studify</h2>
        <ul>
          {footerLinksAbout.map((link, index) => (
            <li key={index}><Link href={link.url}>{link.text}</Link></li>
          ))}
        </ul>
      </div>
      <div className="circle-bg-footer"></div>
    </div>
  )
}

export default Footer