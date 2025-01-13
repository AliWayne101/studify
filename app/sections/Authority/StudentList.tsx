import React from 'react';
import { IStudentCard } from '../../../schema/studentcard';
import "../../css/sections/Authority/basic.scss";
import { RoleProps } from '@/interfaces';
import { isAuthorized } from '@/utils';


const StudentList = ({ Role }: RoleProps) => {
    

    return (
        isAuthorized(Role, ["SU", "HU"]) ? (
            <div>This is it</div>
        ) : null
    );
};

export default StudentList;