"use client"
import Button from '@/app/components/Button'
import Struct from '@/app/Struct'
import React, { useState } from 'react'
import "../../../css/actions/create/class.scss"
import { IClassInfo } from '@/schema/classinfo'

const Class = () => {
    const [classList, setClassList] = useState<IClassInfo[]>([]);
    const buttonClick = () => {

    }

    const DeleteClass = async(cName: string) => {

    }

    return (
        <Struct>
            <div className="class">
                <h2>Class Details</h2>
                <div className="class-create">
                    <h3>Create a Class</h3>
                    <div className="class-create-input">
                        <div className="class-create-input-inside">
                            <label htmlFor="ClassName">Class Name: </label>
                            <input type="text" name='ClassName' id='ClassName' />
                        </div>
                        <div className="class-create-input-inside">
                            <Button onClick={() => buttonClick()}>Create</Button>
                        </div>
                    </div>
                </div>
                <h2>List of Classes</h2>
                <div className="class-create">
                    <div className="class-create-input">
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
        </Struct>
    )
}

export default Class