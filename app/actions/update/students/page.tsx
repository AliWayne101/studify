"use client"
import "../../../css/actions/update/students.scss";
import "../../../css/forms.scss";
import { ShowToast } from '@/app/utilsjsx';
import { UnassignedStudentsProps } from '@/interfaces'
import { getImageLink, sendRequest } from '@/utils';
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import Struct from '@/app/Struct';
import LoadingScreen from '@/app/components/LoadingScreen';
import { motion } from 'framer-motion';
import Button from '@/app/components/Button';
import { IClassInfo } from "@/schema/classinfo";
import { IUserInfo } from "@/schema/userinfo";


const UnassignedStudents = () => {
    const [UnassignedStudents, setUnassignedStudents] = useState<UnassignedStudentsProps>();
    const [isLoadingCompleted, setIsLoadingCompleted] = useState(false);
    const [curWindow, setCurWindow] = useState("select");
    const [classinfo, setClassinfo] = useState<IClassInfo[]>([]);
    const [disabledControl, setDisabledControl] = useState(true);
    const [studentsList, setStudentsList] = useState<IUserInfo[]>([]);
    const { data: session } = useSession();

    const getUnassignedData = async () => {
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

    const getClassData = async () => {
        const response = await sendRequest('/api/posts', {
            Request: "getclass",
            SchoolName: session?.user.schoolName
        });
        if (response.message !== "OK") {
            ShowToast("Class List", response.error, null);
            return;
        }
        if (response.results.docs.length > 0)
            setDisabledControl(false);

        setClassinfo(response.results.docs);
    }

    const classChanged = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        setDisabledControl(true);
        const response = await sendRequest('/api/posts', {
            Request: "getusersbyclass",
            SchoolName: session?.user.schoolName,
            ClassName: e.target.value
        });
        if (response.message !== "OK") {
            ShowToast("Students List", response.error, null);
            return;
        }
        setDisabledControl(false);

        setStudentsList(response.results.docs);
    }

    const AssignClass = async (UID: string) => {
        const selectedClass = (document.getElementById(`selectedClass-${UID}`) as HTMLSelectElement).value;
        const response = await sendRequest('/api/posts', {
            Request: "assignstudent",
            SchoolName: session?.user.schoolName,
            ClassName: selectedClass,
            UID: UID
        });
        if (response.message !== "OK")
            ShowToast("Assigning Student", response.error, null);

        await getUnassignedData();
    }

    return (
        <Struct LoadingCompleted={setIsLoadingCompleted}>
            <LoadingScreen IsLoadingCompleted={isLoadingCompleted}>
                {curWindow === "unassigned" ?
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
                                                    <Button SingleUse={true} onClick={() => AssignClass(user.UID)} >Assign</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                    : curWindow === "list" ?
                        <div className="students">
                            <h1>Students</h1>
                            <p>List of all students by class</p>
                            <div className="forms">
                                <select name="Date" id="Date" onChange={classChanged} disabled={disabledControl}>
                                    <option value="">Select Class</option>
                                    {classinfo.map((_class) => (
                                        <option value={_class.Name} key={_class.UID}>{_class.Name}</option>
                                    ))}
                                </select>
                                <label htmlFor="Date">Class</label>
                            </div>
                            <div className="roundcards grid grid-six ov pt-4">
                                {studentsList.map((user, index) => (
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
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                        :
                        <div className='options'>
                            <div className="options-option" onClick={() => {
                                getClassData();
                                setCurWindow("list");
                            }}>
                                <div className="options-option-mock"></div>
                                <div className="options-option-main">
                                    <h1>List</h1>
                                    <p>List of all students, assigned in your school.</p>
                                </div>
                            </div>

                            <div className="options-option" onClick={() => {
                                getUnassignedData();
                                setCurWindow("unassigned");
                            }}>
                                <div className="options-option-mock"></div>
                                <div className="options-option-main">
                                    <h1>Unassigned</h1>
                                    <p>List of all unassigned students.</p>
                                </div>
                            </div>
                        </div>
                }
            </LoadingScreen>
        </Struct>
    )
}

export default UnassignedStudents