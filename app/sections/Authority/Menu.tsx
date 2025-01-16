import { MenuLinks } from '@/interfaces'
import React from 'react'
import "../../css/sections/Authority/menu.scss"
import Link from 'next/link'

const Menu = ({ Links }: { Links: MenuLinks[] }) => {
    return (
        <div className="menu">
            <h2>Actions</h2>
            <div className="menu-items">
                {Links.map((link, index) => (
                    <div className="menu-items-item" key={index}>
                        <Link href={link.url}>{link.text}</Link>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Menu