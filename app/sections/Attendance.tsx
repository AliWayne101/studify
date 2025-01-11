import React from 'react'

interface IAttendance {
    Role: string,
    SchoolName: string,
}

const Attendance = ({ Role, SchoolName }: IAttendance) => {
    return (
        <div>Attendance</div>
    )
}

export default Attendance