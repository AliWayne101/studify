"use client"
import { NavLinks, WebDetails } from '@/configs'
import Link from 'next/link'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Navbar = () => {
    const [isNavToggle, setIsNavToggle] = useState(false);
    return (
        <>
            <div className={`navbar`}>
                <div className="navbar-logo">
                    <Link href={'/'}>{WebDetails.webName}</Link>
                </div>

                <div className="navbar-menu">
                    {NavLinks.map((link, index) => (
                        <Link href={link.url} className='navbar-menu-item' key={index}>{link.text}</Link>
                    ))}
                </div>

                <div className="navbar-user">
                    <Link href={'/profile'}>Profile</Link>
                    <Link href={'/logout'}>Logout</Link>
                </div>

                <div className="navbar-burger">
                    <span onClick={() => setIsNavToggle(true)}>Burger</span>
                </div>
            </div>
            <AnimatePresence>
                {isNavToggle && (
                    <motion.div 
                        className="navbar-mobile"
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="navbar-mobile-burger">
                            <span onClick={() => setIsNavToggle(false)}>Burger</span>
                        </div>
                        <div className="navbar-mobile-menu">
                            {NavLinks.map((link, index) => (
                                <div className="navbar-mobile-menu-item" key={index}>
                                    <Link href={link.url}>{link.text}</Link>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default Navbar