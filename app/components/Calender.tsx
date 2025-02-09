import React from 'react';
import "../css/calender.scss";
import { AttendanceStructProps } from '@/interfaces';

interface CalendarProps {
    data: AttendanceStructProps[];
    handleClick?: (day: number) => void;
    firstDayOfMonth?: number;
}

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Calendar: React.FC<CalendarProps> = ({ data, handleClick, firstDayOfMonth }) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const _firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    return (
        <div className='calender'>
            <div className='header'>
                {daysOfWeek.map((day) => (
                    <div key={day} className="day">{day}</div>
                ))}
            </div>
            <div className="body">
                {Array.from({ length: firstDayOfMonth || _firstDayOfMonth }).map((_, index) => (
                    <div key={index + "empty"} className="empty"></div>
                ))}
                {data.map((dayStatus) => (
                    handleClick && dayStatus.Status === 'present' || dayStatus.Status === 'filled' ?
                        <div
                            key={dayStatus.Day}
                            className={`cell pointer ${dayStatus.Status}`}
                            title={dayStatus.Status}
                            onClick={handleClick ? () => handleClick(dayStatus.Day) : undefined}
                        >
                            <span>{dayStatus.Day}</span>
                        </div>
                        :
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
