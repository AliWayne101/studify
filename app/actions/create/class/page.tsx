"use client"
import Button from '@/app/components/Button'
import Struct from '@/app/Struct'
import React, { useEffect, useState } from 'react'
import "../../../css/actions/create/class.scss"
import { IClassInfo } from '@/schema/classinfo'
import { isAuthorized, sendRequest } from '@/utils'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Loading from '@/app/components/Loading'
import { FaArrowLeft } from 'react-icons/fa'

const Class = () => {
    const [classList, setClassList] = useState<IClassInfo[]>([]);
    const [newClassName, setNewClassName] = useState("");
    const [isError, setIsError] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [curWindow, setCurWindow] = useState("");

    const { data: session } = useSession();
    const router = useRouter();
    useEffect(() => {
        if (session === undefined)
            router.push('/login');
        else {
            if (session?.user.role !== "Owner" && session?.user.role !== "Admin")
                router.push('/dashboard');

            LoadData();
        }
    }, [session])

    const LoadData = async () => {
        const response = await sendRequest('/api/posts', {
            Request: "getclass",
            SchoolName: session?.user.schoolName
        });
        if (response.message === "OK") {
            console.log(response.results);
            setClassList(response.results.docs);
        } else {
            setIsError(response.error);
        }
        setIsLoading(false);
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

    const DeleteClass = async (cName: string) => {

    }

    return (
        <Struct>
            {isError && <div className="error">{isError}</div>}
            {
                curWindow === "create" ?
                    isLoading ? <Loading Size={48} /> :
                        <div className="class">
                            <div className="navback link" onClick={() => setCurWindow("")}><FaArrowLeft className='navback-icon' />Go Back</div>
                            <h2>Class Details</h2>
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
                                <div className="class-create-input bold">
                                    <div className="class-create-input-inside">Class Name</div>
                                    <div className="class-create-input-inside">Actions</div>
                                </div>
                                {classList.map((item, index) => (
                                    <div className="class-create-input" key={index}>
                                        <div className="class-create-input-inside"><span>{item.Name}</span></div>
                                        <div className="class-create-input-inside"><span className='pointer' onClick={() => DeleteClass(item.Name)}>Delete</span></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    : curWindow === "assign" ?
                        <div className="class">
                            <div className="navback link" onClick={() => setCurWindow("")}><FaArrowLeft className='navback-icon' />Go Back</div>
                            
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

        </Struct>
    )
}

export default Class