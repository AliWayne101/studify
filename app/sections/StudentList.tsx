import React from 'react';
import { IStudentCard } from '../../schema/studentcard';
import "../css/sections/studentlist.scss";

interface StudentListProps {
    students: IStudentCard[];
}

const StudentList: React.FC<StudentListProps> = ({ students }) => {
    return (
        <div>
            {/* Under Development Develop cards */}
            {students.map(student => (
                <div key={student.UID}>
                    <h3>{student.Name}</h3>
                    <p>Grade: {student.Grade}</p>
                    <p>School: {student.SchoolName}</p>
                    {/* Add more student details as needed */}
                </div>
            ))}
        </div>
    );
};

export default StudentList;