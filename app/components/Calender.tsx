import React from 'react';
import "../css/calender.scss";
import { AttendanceStructProps } from '@/interfaces';

interface CalendarProps {
    data: AttendanceStructProps[];
}

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Calendar: React.FC<CalendarProps> = ({ data }) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    return (
        <div className='calender'>
            <div className='header'>
                {daysOfWeek.map((day, index) => (
                    <div key={index} className="day">{day}</div>
                ))}
            </div>
            <div className="body">
                {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                    <div key={index} className="empty"></div>
                ))}
                {data.map((dayStatus) => (
                    <div
                        key={dayStatus.Day}
                        className={`cell ${dayStatus.Status}`}
                        title={dayStatus.Status}
                    >
                        <span>{dayStatus.Day}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Calendar;
