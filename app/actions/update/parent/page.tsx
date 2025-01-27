"use client"
import '../../../css/actions/update/updateparent.scss';
import LoadingScreen from '@/app/components/LoadingScreen';
import Struct from '@/app/Struct';
import { ShowToast } from '@/app/utilsjsx';
import { UpdateParentInterface } from '@/interfaces';
import { getImageLink, sendRequest } from '@/utils';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { IUserInfo } from '@/schema/userinfo';

const UpdateParent = () => {
    const [parentDetails, setParentDetails] = useState<UpdateParentInterface>();
    const [isLoadingCompleted, setIsLoadingCompleted] = useState(false);
    const [userList, setUserList] = useState<IUserInfo[] | undefined>([]);
    const { data: session } = useSession();

    useEffect(() => {
        if (session) getData();
    }, [session])

    const getData = async () => {
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
    }

    return (
        <Struct LoadingCompleted={setIsLoadingCompleted}>
            <LoadingScreen IsLoadingCompleted={isLoadingCompleted}>
                <div className="parentform">
                    <div className="parentform-left">
                        <h2>Students</h2>
                        <small>List of students categorized by Class</small>
                        <div>
                            <select
                                name="ClassList"
                                id="ClassList"
                                onChange={(e) => {
                                    setUserList(parentDetails?.Students.find(x => x.Class === e.target.value)?.Students);
                                }}
                            >
                                <option value="">Select Class</option>
                                {parentDetails?.Students.map((item, index) => (
                                    <option key={index} value={item.Class}>{item.Class}</option>
                                ))}
                            </select>
                        </div>
                        <div className="roundcards grid grid-five ov">
                            {userList?.map((item, index) => (
                                <div className="roundcards-card ov-body" key={index}>
                                    <div className="ov-mock"></div>
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
                                                <li>{item.Name}</li>
                                                <li>{item.Gender}</li>
                                                <li>{item.FeeOrSalary.toLocaleString()} PKR Fee</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ))}

                        </div>
                    </div>


                </div>
            </LoadingScreen>
        </Struct>
    )
}

export default UpdateParent