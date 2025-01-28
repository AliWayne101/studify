"use client"
import { ShowToast } from '@/app/utilsjsx';
import { UnassignedStudentsProps } from '@/interfaces'
import { getImageLink, sendRequest } from '@/utils';
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import Struct from '@/app/Struct';
import LoadingScreen from '@/app/components/LoadingScreen';
import Button from '@/app/components/Button';
import { motion } from 'framer-motion';

const UnassignedStudents = () => {
    const [UnassignedStudents, setUnassignedStudents] = useState<UnassignedStudentsProps>();
    const [isLoadingCompleted, setIsLoadingCompleted] = useState(false);
    const { data: session } = useSession();

    const getData = async () => {
        const response = await sendRequest('/api/posts', {
            Request: "unassignedStudents",
            SchoolName: session?.user.schoolName
        });
        if (response.message !== "OK") {
            ShowToast("Unassigned Students List", response.error, null);
            return;
        }
        setUnassignedStudents(response.results.doc);
    }

    useEffect(() => {
        if (session) getData();
    }, [session])

    const AssignClass = async (UID: string) => {
        const selectedClass = (document.getElementById(`selectedClass-${UID}`) as HTMLSelectElement).value;
        setIsLoadingCompleted(false);
        const response = await sendRequest('/api/posts', {
            Request: "assignstudent",
            SchoolName: session?.user.schoolName,
            ClassName: selectedClass,
            UID: UID
        });
        if (response.message !== "OK") {
            setIsLoadingCompleted(true);
            ShowToast("Assigning Student", response.error, null);
            return;
        }
        await getData();
        setIsLoadingCompleted(true);
    }

    return (
        <Struct LoadingCompleted={setIsLoadingCompleted}>
            <LoadingScreen IsLoadingCompleted={isLoadingCompleted}>
                <div className='pt-4'>
                    <h2>Students List</h2>
                    <small>List of unassigned students, who are not yet assigned to any class yet</small>
                    <div className="roundcards grid grid-six ov pt-4">
                        {UnassignedStudents?.Students.map((user, index) => (
                            <motion.div
                                className="roundcards-card ov-body"
                                key={index}
                                custom={index}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: 0.2 * index }}
                                variants={{
                                    visible: { opacity: 1, scale: 1 },
                                    hidden: { opacity: 0, scale: 0 }
                                }}
                            >
                                <div className="ov-mock"></div>
                                <div className="ov-body-in">
                                    <div className="roundcards-card-img">
                                        <div className="img-cont">
                                            <Image
                                                layout="fill"
                                                objectFit="cover"
                                                src={getImageLink(user.Image)}
                                                alt={user.Image}
                                            />
                                        </div>
                                    </div>
                                    <div className="roundcards-card-details">
                                        <ul>
                                            <li>{user.Name}</li>
                                            <li>{user.Gender}</li>
                                            <li>{user.FeeOrSalary.toLocaleString()} PKR Fee</li>
                                        </ul>
                                        <div className="buttons">
                                            <div>
                                                <select name="selectedClass" id={`selectedClass-${user.UID}`}>
                                                    <option value="">Select a class</option>
                                                    {UnassignedStudents.Classes.map((c, i) => (
                                                        <option value={c.Name} key={i}>{c.Name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <Button onClick={() => AssignClass(user.UID)} >Assign</Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </LoadingScreen>
        </Struct>
    )
}

export default UnassignedStudents