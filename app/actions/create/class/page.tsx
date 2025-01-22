"use client"
import Button from '@/app/components/Button'
import Struct from '@/app/Struct'
import React, { useEffect, useState } from 'react'
import "../../../css/actions/create/class.scss"
import { IClassInfo } from '@/schema/classinfo'
import { sendRequest, UnassignedTeachers } from '@/utils'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Loading from '@/app/components/Loading'
import { FaArrowLeft } from 'react-icons/fa'
import { IUserInfo } from '@/schema/userinfo'

const Class = () => {
    const [classList, setClassList] = useState<IClassInfo[]>([]);
    const [teachersList, setTeachersList] = useState<IUserInfo[]>([]);
    const [newClassName, setNewClassName] = useState("");
    const [isError, setIsError] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [curWindow, setCurWindow] = useState("");
    const [targetClass, setTargetClass] = useState("");
    const [targetClassInfo, setTargetClassInfo] = useState<IClassInfo | undefined>(undefined);
    const [assignSelectTeacher, setAssignSelectTeacher] = useState("");

    const { data: session } = useSession();
    const router = useRouter();
    useEffect(() => {
        if (session === undefined)
            router.push('/login');
        else {
            if (session?.user.role !== "Owner" && session?.user.role !== "Admin")
                router.push('/dashboard');

            LoadUsers();
            LoadData();
        }
    }, [session])

    const LoadData = async () => {
        setIsLoading(true);
        const response = await sendRequest('/api/posts', {
            Request: "getclass",
            SchoolName: session?.user.schoolName
        });
        if (response.message === "OK") {
            setClassList(response.results.docs);
        } else {
            setIsError(response.error);
        }
        setIsLoading(false);
    }

    const LoadUsers = async () => {
        const response = await sendRequest('/api/posts', {
            Request: "getusersbyrole",
            Role: "Teacher",
            SchoolName: session?.user.schoolName
        });
        if (response.message === "OK") {
            setTeachersList(response.results.docs);
        } else {
            setIsError(response.error);
        }
    }

    const createClass = async () => {
        if (newClassName.length === 0)
            return;
        const response = await sendRequest("/api/posts", {
            Request: "createclass",
            ClassName: newClassName,
            SchoolName: session?.user.schoolName
        });
        if (response.message === "OK") {
            setIsError(undefined);
            setNewClassName("");
            LoadData();
        } else {
            setIsError(response.error);
        }
    }

    useEffect(() => {
        if (targetClass !== "") {
            setTargetClassInfo(classList.find(x => x.UID === targetClass));
        }
    }, [targetClass])

    const DeleteClass = async (uid: string) => {
        setIsLoading(true);
        const response = await sendRequest('/api/posts', {
            Request: "deleteclass",
            UID: uid,
            SchoolName: session?.user.schoolName
        });
        if (response.message === "OK") {
            LoadData();
        } else {
            setIsLoading(false);
            setIsError("Unable to delete the class, please try again or contact the developer");
        }
    }

    const UnassignTeacher = async () => {
        if (targetClass === "") return;
        setIsLoading(true);
        const response = await sendRequest('/api/posts', {
            Request: "assignclass",
            ClassUID: targetClass,
            TeacherUID: "unassigned",
            Caster: session?.user.name
        });
        if (response.message === "OK") {
            setTargetClass("");
            LoadData();
        } else {
            setIsError(response.error);
            setIsLoading(false);
        }
    }

    const AssignTeacher = async () => {
        if (assignSelectTeacher === "") return;
        setIsLoading(true);
        const response = await sendRequest('/api/posts', {
            Request: 'assignclass',
            TeacherUID: assignSelectTeacher,
            ClassUID: targetClass,
            Caster: session?.user.name
        });
        if (response.message === "OK") {
            setTargetClass("");
            setAssignSelectTeacher("");
            LoadData();
        }
        else {
            setIsError(response.error);
            setIsLoading(false);
        }
    }

    return (
        <Struct>
            {isError && <div className="error">{isError}</div>}
            {
                isLoading ? <Loading Size={48} /> :
                    <>
                        {
                            curWindow === "create"
                                ? <div className="class">
                                    <div className="navback">
                                        <span className='link' onClick={() => setCurWindow("")}><FaArrowLeft className='navback-icon' />Go Back</span>
                                    </div>
                                    <h2>Create Class</h2>
                                    <p>Create a class to be assigned by teachers and students</p>
                                    <div className="class-create">
                                        <h3>Create a Class</h3>
                                        <div className="class-create-input">
                                            <div className="class-create-input-inside">
                                                <label htmlFor="ClassName">Class Name: </label>
                                                <input type="text" name='ClassName' id='ClassName' value={newClassName} onChange={(e) => setNewClassName(e.target.value)} />
                                            </div>
                                            <div className="class-create-input-inside">
                                                <Button onClick={() => createClass()}>Create</Button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="class-create">
                                        <h3>List of Classes</h3>
                                        <ul>
                                            {classList.map((item, index) => (
                                                <li key={index}>
                                                    <div>Class</div>
                                                    <h2>{item.Name}</h2>
                                                    <div className='class-create-icon'><span className='pointer' onClick={() => DeleteClass(item.UID)}>Delete</span></div>
                                                </li>
                                            ))}
                                        </ul>

                                    </div>
                                </div>
                                : curWindow === "assign"
                                    ? <div className="class">
                                        <div className="navback">
                                            <span className='link' onClick={() => setCurWindow("")}><FaArrowLeft className='navback-icon' />Go Back</span>
                                        </div>
                                        <h2>Assign Class</h2>
                                        <p>Assign teachers to specific class</p>
                                        <div className="class-assign">
                                            <div className="class-assign-list">
                                                <h3>Class list</h3>
                                                <ul>
                                                    {classList.map((item, index) => (
                                                        <li
                                                            key={index}
                                                            onClick={() => setTargetClass(item.UID)}
                                                            className={`${targetClass === item.UID ? "border" : ""}`}
                                                        >{item.Name}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="class-assign-info">
                                                {targetClass !== "" &&
                                                    <div className="class-assign-info-in">
                                                        <h3>Assignment Details</h3>
                                                        {targetClassInfo && targetClassInfo?.TeacherUID !== "unassigned" ?
                                                            <div className="class-assign-info-in-detail">
                                                                <div className="class-assign-info-in-detail-basic">
                                                                    <h3>Assigned Teacher</h3>
                                                                    Name: <b>{teachersList.find(x => x.UID === targetClassInfo.TeacherUID)?.Name}</b>
                                                                    <div>
                                                                        <Button onClick={UnassignTeacher}>Unassign</Button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            : <div className="class-assign-info-in-detail">
                                                                <h3>List of Unassigned Teachers</h3>
                                                                <select name="Teacer" id="Teacer" onChange={(e) => setAssignSelectTeacher(e.target.value)}>
                                                                    <option className='bg' value="">Select Teacher</option>
                                                                    {UnassignedTeachers(teachersList, classList).map((teacher, index) => (
                                                                        <option className='bg' value={teacher.UID} key={index}>{teacher.Name}</option>
                                                                    ))}
                                                                </select>
                                                                <Button onClick={AssignTeacher}>Assign</Button>
                                                            </div>
                                                        }
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <div className='options'>
                                        <div className="options-option" onClick={() => setCurWindow("create")}>
                                            <div className="options-option-mock"></div>
                                            <div className="options-option-main">
                                                <h1>Create</h1>
                                                <p>Create a new class of your school, to assign children and teachers</p>
                                            </div>
                                        </div>

                                        <div className="options-option" onClick={() => setCurWindow("assign")}>
                                            <div className="options-option-mock"></div>
                                            <div className="options-option-main">
                                                <h1>Assign</h1>
                                                <p>Assign a teacher to any specific class</p>
                                            </div>
                                        </div>
                                    </div>
                        }
                    </>
            }

        </Struct>
    )
}

export default Class