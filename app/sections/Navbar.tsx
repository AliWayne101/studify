"use client"
import { NavLinks, WebDetails } from '@/configs'
import Link from 'next/link'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { SignOut } from '../auth'
import { RxHamburgerMenu } from 'react-icons/rx'
import { GrFormClose } from 'react-icons/gr'

const Navbar = () => {
    const [isNavToggle, setIsNavToggle] = useState(false);
    const { data: session, status } = useSession();
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
                    {session ? (
                        <>
                            <Link href={'/profile'}>Profile</Link>
                            <span className="link" onClick={SignOut}>Logout</span>
                        </>
                    ) : (
                        <Link href={'/login'}>Login</Link>
                    )}

                </div>

                <div className="navbar-burger">
                    <RxHamburgerMenu size={22} onClick={() => setIsNavToggle(true)} />
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
                            <GrFormClose size={32} onClick={() => setIsNavToggle(false)} />
                        </div>
                        <div className="navbar-mobile-menu">
                            {NavLinks.map((link, index) => (
                                <div className="navbar-mobile-menu-item" key={index}>
                                    <Link href={link.url}>{link.text}</Link>
                                </div>
                            ))}
                            <div className="navbar-mobile-menu-item">
                                <Link href={'/profile'}>Profile</Link>
                            </div>
                            <div className="navbar-mobile-menu-item">
                                <span className="link" onClick={SignOut}>Logout</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default Navbar