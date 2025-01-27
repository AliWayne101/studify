"use client"
import '../../../css/actions/update/updateparent.scss';
import '../../../css/login.scss';
import LoadingScreen from '@/app/components/LoadingScreen';
import Struct from '@/app/Struct';
import { ShowToast } from '@/app/utilsjsx';
import { UpdateParentInterface } from '@/interfaces';
import { getImageLink, sendRequest } from '@/utils';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { IUserInfo } from '@/schema/userinfo';
import Button from '@/app/components/Button';

const UpdateParent = () => {
    const [parentDetails, setParentDetails] = useState<UpdateParentInterface>();
    const [isLoadingCompleted, setIsLoadingCompleted] = useState(false);
    const [userList, setUserList] = useState<IUserInfo[] | undefined>([]);
    const [targetUser, setTargetUser] = useState<IUserInfo | undefined>(undefined);
    const [parentList, setParentList] = useState<IUserInfo[]>([]);
    const [selectedParent, setSelectedParent] = useState<IUserInfo | undefined>(undefined);
    const { data: session } = useSession();

    useEffect(() => {
        if (session) getData();
    }, [session])

    const getData = async () => {
        console.log("Fetching data..");
        const response = await sendRequest('/api/posts', {
            Request: "parentdetailview",
            Role: session?.user.role,
            SchoolName: session?.user.schoolName
        });
        if (response.message !== "OK") {
            ShowToast("Error", response.error, null);
            return;
        }
        setParentDetails(response.results.doc);
        setParentList(response.results.doc.Parents);
    }

    const nestList = (matching: string) => {
        if (!matching) {
            setParentList(parentDetails?.Parents || []);
            return;
        }
        const filteredParents = parentDetails?.Parents.filter(parent =>
            parent.Name.toLowerCase().includes(matching.toLowerCase())
        );
        setParentList(filteredParents || []);
    }

    const AssignParent = async () => {
        const response = await sendRequest('/api/posts', {
            Request: "updateparent",
            ParentUID: selectedParent?.UID,
            StudentUID: targetUser?.UID,
            SchoolName: session?.user.schoolName,
            Role: session?.user.role
        });
        if (response.message === "OK") {
            const msg = selectedParent?.Name + " has been assigned as a guardian of " + targetUser?.Name;
            ShowToast("Guardian Assignment", msg, null);
            getData();
        } else {
            ShowToast("Guardian Assignment", response.error, null);
        }
        setSelectedParent(undefined);
        setTargetUser(undefined);
        setUserList([]);
    }

    return (
        <Struct LoadingCompleted={setIsLoadingCompleted}>
            <LoadingScreen IsLoadingCompleted={isLoadingCompleted}>
                <div className={`parentform screen ${targetUser === undefined ? 'screen-max' : 'screen-min'}`}>
                    <div className="parentform-left">
                        <h2>Students</h2>
                        <small>List of students categorized by Class</small>
                        <div>
                            <select
                                name="ClassList"
                                id="ClassList"
                                onChange={(e) => {
                                    setUserList(parentDetails?.Students.find(x => x.Class === e.target.value)?.Students);
                                    setTargetUser(undefined);
                                }}
                            >
                                <option value="">Select Class</option>
                                {parentDetails?.Students.map((item, index) => (
                                    <option key={index} value={item.Class}>{item.Class}</option>
                                ))}
                            </select>
                        </div>
                        <div className={`roundcards grid ov ${targetUser === undefined ? 'grid-five' : 'grid-four'}`}>
                            {userList?.map((item, index) => (
                                <div
                                    className="roundcards-card ov-body"
                                    key={index}
                                    onClick={() => {
                                        setTargetUser(item);
                                        setSelectedParent(undefined);
                                    }}
                                >
                                    <div className={`ov-mock ${targetUser === item && 'ov-mock-selected'}`}></div>
                                    <div className="ov-body-in">
                                        <div className="roundcards-card-img">
                                            <div className="img-cont">
                                                <Image
                                                    layout="fill"
                                                    objectFit="cover"
                                                    src={getImageLink(item.Image)}
                                                    alt={item.Image}
                                                />
                                            </div>
                                        </div>
                                        <div className="roundcards-card-details">
                                            <ul>
                                                <li><span>{item.Name}</span></li>
                                                <li><span>{item.Gender}</span></li>
                                                <li>Guardian: <span>{item.ParentUID.length > 0 ? parentList.find(x => x.UID === item.ParentUID[0])?.Name : "unassigned"}</span></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ))}

                        </div>
                    </div>
                    <div className="parentform-right second">
                        {
                            selectedParent === undefined ?
                                <>
                                    <h2>Parents</h2>
                                    <small>List of registered guardians in your school</small>
                                    <div className="login">
                                        <div className="login-in">
                                            <input onChange={(e) => nestList(e.target.value)} type="text" name="uid" id="uid" />
                                            <label htmlFor="uid">Search</label>
                                        </div>
                                    </div>
                                    {parentList.map((parent, index) => (
                                        <div className="entrybar" key={index} onClick={() => setSelectedParent(parent)}>
                                            {parent.Name}
                                        </div>
                                    ))}
                                </>
                                :
                                <>
                                    <h2>Confirmation</h2>
                                    <p>Do you want to assign <span>{selectedParent.Name}</span> to be guardian of <span>{targetUser?.Name}</span></p>
                                    <div className="buttons">
                                        <Button onClick={AssignParent}>Confirm</Button>
                                        <Button onClick={() => setSelectedParent(undefined)}>Cancel</Button>
                                    </div>
                                </>
                        }

                    </div>
                </div>
            </LoadingScreen>
        </Struct>
    )
}

export default UpdateParent