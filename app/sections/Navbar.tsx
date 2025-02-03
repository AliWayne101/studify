"use client"
import { DashboardLinks, NavLinks, WebDetails } from '@/configs'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { SignOut } from '../auth'
import { RxHamburgerMenu } from 'react-icons/rx'
import { GrFormClose } from 'react-icons/gr'
import { Bounce, ToastContainer } from 'react-toastify'
import { sendRequest } from '@/utils'
import { INotifInfo } from '@/schema/notifinfo'
import { usePathname, useRouter } from 'next/navigation'
import { ShowToast } from '../utilsjsx'

interface NavbarProps {
    updateParentState: React.Dispatch<React.SetStateAction<boolean>>;
    LoadingCompleted?: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({ updateParentState, LoadingCompleted }) => {
    const [isNavToggle, setIsNavToggle] = useState(false);
    const [navSolidBG, setNavSolidBG] = useState(false);
    const { data: session } = useSession();

    const router = useRouter();
    const pathname = usePathname();

    const handleSignOut = () => {
        SignOut();
        updateParentState(false); // Update parent state on sign out
    };

    const updateParentStateFromHere = (cond: boolean) => {
        setIsNavToggle(cond);
        updateParentState(cond);
    }

    useEffect(() => {
        console.log(pathname);
        var findAddress = DashboardLinks.find(x => x.url === pathname);
        //Check NavLinks if Address is not located
        if (findAddress === undefined)
            findAddress = NavLinks.find(x => x.url === pathname);

        if (findAddress) {
            if (findAddress.isProtected) {
                if (session === null || session === undefined) {
                    router.push('/login');
                }
                else {
                    if (LoadingCompleted)
                        if (findAddress.ProtectionLevel) {
                            const roleExists = findAddress.ProtectionLevel.find(y => y === session.user.role);
                            if (!roleExists)
                                router.push('/login');
                            else
                                LoadingCompleted(true);
                        } else
                            LoadingCompleted(true);
                }
            }
        } else
            if (LoadingCompleted)
                LoadingCompleted(true);


        const getNotifs = async () => {
            const response = await sendRequest("/api/posts", {
                Request: "getnotifs",
                SchoolName: session?.user.schoolName,
                To: session?.user.uid
            });
            if (response.message === "OK")
                for (const doc of response.results.docs) {
                    var notif: INotifInfo = doc;
                    const _from = "From: " + notif.From;
                    ShowToast(notif.Title, notif.Text, null, _from);
                }
        }
        if (session)
            getNotifs();
    }, [pathname, session])

    useEffect(() => {
        window.addEventListener("scroll", () => {
            if (!isNavToggle)
                window.pageYOffset >= 80 ? setNavSolidBG(true) : setNavSolidBG(false);
        })
    }, []);

    return (
        <>
            <div className={`navbar ${navSolidBG ? 'nav-solid box-shadow' : ''}`}>
                <div className="navbar-logo">
                    <Link href={'/'}>{WebDetails.webName}</Link>
                </div>

                <div className="navbar-menu">
                    {NavLinks.filter(x => x.IsVisible).map((link, index) => (
                        link.isProtected ? (
                            session && <Link href={link.url} className='navbar-menu-item' key={index}>{link.text}</Link>
                        ) :
                            <Link href={link.url} className='navbar-menu-item' key={index}>{link.text}</Link>
                    ))}
                </div>

                <div className="navbar-user">
                    {session ? (
                        <>
                            <Link href={'/profile'}>Profile</Link>
                            <span className="link" onClick={handleSignOut}>Logout</span>
                        </>
                    ) : (
                        <Link href={'/login'}>Login</Link>
                    )}

                </div>

                <div className="navbar-burger">
                    {isNavToggle == false && (
                        <RxHamburgerMenu size={22} onClick={() => updateParentStateFromHere(true)} />
                    )}
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
                            <GrFormClose size={32} onClick={() => updateParentStateFromHere(false)} />
                        </div>
                        <div className="navbar-mobile-menu">
                            {NavLinks.filter(x => x.IsVisible).map((link, index) => (
                                link.isProtected ? (
                                    session && (
                                        <div className="navbar-mobile-menu-item" key={index}>
                                            <Link href={link.url}>{link.text}</Link>
                                        </div>
                                    )
                                ) :
                                    <div className="navbar-mobile-menu-item" key={index}>
                                        <Link href={link.url}>{link.text}</Link>
                                    </div>
                            ))}
                            {session ? (
                                <>
                                    <div className="navbar-mobile-menu-item">
                                        <Link href={'/profile'}>Profile</Link>
                                    </div>
                                    <div className="navbar-mobile-menu-item">
                                        <span className="link" onClick={handleSignOut}>Logout</span>
                                    </div>
                                </>
                            ) : (
                                <div className="navbar-mobile-menu-item">
                                    <Link href={'/login'}>Login</Link>
                                </div>
                            )}

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <ToastContainer
                position="bottom-right"
                autoClose={10000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={true}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Bounce}
            />
        </>
    )
}

export default Navbar