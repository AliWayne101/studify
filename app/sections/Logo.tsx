import React from 'react'
import { WebDetails } from '@/configs';
import "../css/sections/hero.scss";
import Link from 'next/link';

const Logo = () => {
    return (
        <div className="hero">
            <h1><Link href={'/'}>{WebDetails.webName}</Link></h1>
            <p>{WebDetails.webMotto}</p>
        </div>
    )
}

export default Logo