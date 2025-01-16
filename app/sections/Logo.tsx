import React from 'react'
import { WebDetails } from '@/configs';
import "../css/sections/hero.scss";

const Logo = () => {
    return (
        <div className="hero">
            <h1>{WebDetails.webName}</h1>
            <p>{WebDetails.webMotto}</p>
        </div>
    )
}

export default Logo