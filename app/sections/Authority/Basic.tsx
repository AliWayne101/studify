"use client"
import React, { useState } from 'react'
import "../../css/sections/Authority/basic.scss"
import { motion } from 'framer-motion';
import { TbActivityHeartbeat } from 'react-icons/tb';
import { RoleProps } from '@/interfaces';
import { isAuthorized } from '@/utils';

const boxVariants = {
    hidden: { opacity: 0, x: 400 },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.3
        }
    })
};

const Basic = ({ Role }: RoleProps) => {
    const [basicInfo, setBasicInfo] = useState([
        { Title: "Students", Info: "200" },
        { Title: "Teachers", Info: "10" },
        { Title: "Adm. month", Info: "5" },
        { Title: "Present Teachers", Info: "5/10" },
    ]);

    return (
        isAuthorized(Role, ["SU", "HU"]) ? (
            <div className="basic">
                <h2>Basic Information</h2>
                <div className="basic-boxes">
                    {basicInfo.map(({Title, Info}, index) => (
                        <motion.div
                            className="basic-boxes-box bg-sec hl-bg"
                            custom={index}
                            initial="hidden"
                            animate="visible"
                            variants={boxVariants}
                            key={index}
                        >
                            <div className="basic-boxes-box-in">
                                <div><TbActivityHeartbeat className='basic-bg-icon' /></div>
                                <div>{Title}</div>
                                <div>{Info}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        ) : null
    )
}

export default Basic