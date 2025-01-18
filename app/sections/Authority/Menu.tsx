import { MenuLinks, SessionProps } from '@/interfaces'
import React, { useEffect, useState } from 'react'
import "../../css/sections/Authority/menu.scss"
import Link from 'next/link'
import { AdminLinks, OwnerLinks, TeacherLinks } from '@/configs'

const Menu = ({ session }: SessionProps) => {
    const [links, setLinks] = useState<MenuLinks[]>([]);

    useEffect(() => {
        switch(session.user.role) {
            case "Teacher":
                setLinks(TeacherLinks);
                break;
            case "Owner":
                setLinks(OwnerLinks);
                break;
            case "Admin":
                setLinks(AdminLinks);
                break;
        }
    }, [session])
    return (
        <div className="menu">
            <h2>Actions</h2>
            <div className="menu-items">
                {links.map((link, index) => (
                    <div className="menu-items-item" key={index}>
                        <Link href={link.url}>{link.text}</Link>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Menu