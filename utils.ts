import { compare, genSalt, hash } from 'bcryptjs';
import mongoose from 'mongoose';
import { AVATAR_LINK, RolesWithAuthority, SALT_LENGTH } from './configs';
import { AttendanceStructProps } from './interfaces';
import { IUserInfo } from './schema/userinfo';
import { IClassInfo } from './schema/classinfo';
import { NextResponse } from 'next/server';

export const hashPassword = async (password: string) => {
    const _salt = await genSalt(SALT_LENGTH);
    const hashedPassword = await hash(password.toString(), _salt);
    return hashedPassword;
}

export const isPasswordValid = async (password: string, hashedPassword: string) => {
    const isValid = await compare(password, hashedPassword);
    return isValid;
}

export const UniqueID = (length: number) => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export const isAuthorized = (Role: string | undefined, Levels: string[]) => {
    if (Role === undefined) return false;
    const roleDetails = RolesWithAuthority.find(r => r.role === Role);
    if (roleDetails !== undefined)
        return Levels.includes(roleDetails?.authorityLevel);
    else
        return false;
}

export const getImageLink = (Data: string | undefined) => {
    if (Data === "default" || Data === undefined)
        return AVATAR_LINK;
    else
        return Data;
}

export const Connect = async () => {
    if (mongoose.connection.readyState >= 1) return;
    mongoose.connect(process.env.NEXT_PUBLIC_MONGODB_ACCESS!);
}

export const getDate = (): { Month: string, Year: number, Day: number } => {
    const currentDate = new Date();
    return {
        Month: currentDate.toLocaleString('default', { month: 'long' }),
        Year: currentDate.getFullYear(),
        Day: currentDate.getDate()
    }
}

export const sendRequest = async (address: string, _body: object, method: string = "POST") => {
    const response = await fetch(address, {
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(_body)
    });
    if (!response.ok) {
        return {
            message: "error",
            error: "Network problem, please refresh the page.."
        }
    }
    const data = await response.json();
    if (data.message !== "OK") {
        return {
            message: data.message,
            error: data.error
        }
    }

    return {
        message: "OK",
        results: data
    }
}

export const AttStatusDay = (Data: AttendanceStructProps[] | undefined, Day: number, Condition: string) => {
    if (Data === undefined) return null;
    const dayIndex = Data.findIndex(a => a.Day === Day);
    if (dayIndex > -1) {
        if (Data[dayIndex].Status === Condition)
            return true;
        else
            return false;
    } else
        return false;
}

export const AttStatus = (Data: AttendanceStructProps[] | undefined) => {
    var _attStatus = "";
    var isPresent = false;
    const _date = getDate();

    if (Data == undefined) {
        return {
            Status: "",
            IsPresent: false
        }
    }

    for (const _day of Data) {
        if (_day.Day === _date.Day) {
            _attStatus = _day.Status;
            isPresent = true;
        }
    }
    return {
        Status: _attStatus,
        IsPresent: isPresent
    }
}

export const UnassignedTeachers = (Users: IUserInfo[], Classes: IClassInfo[]) => {
    const unassignedUsers: IUserInfo[] = [];
    for (const user of Users) {
        const assignedClass = Classes.find(x => x.TeacherUID === user.UID);
        if (assignedClass === undefined) unassignedUsers.push(user);
    }
    return unassignedUsers;
}

export const CreateNotification = async (title: string, text: string, from: string, to: string) => {
    const response = await sendRequest('/api/posts', {
        Request: "createnotif",
        Title: title,
        Text: text,
        From: from,
        To: to
    });
    if (response.message === "OK")
        return true;
    else
        return false;
}

export const ServResponse = (body: Object) => {
    NextResponse.json(body, { status: 200 });
}
export type MonthNames = 'January' | 'February' | 'March' | 'April' | 'May' | 'June' | 'July' | 'August' | 'September' | 'October' | 'November' | 'December';
export const monthIndices: Record<MonthNames, number> = {
    January: 0,
    February: 1,
    March: 2,
    April: 3,
    May: 4,
    June: 5,
    July: 6,
    August: 7,
    September: 8,
    October: 9,
    November: 10,
    December: 11
};

export const fillAttendanceData = (data: AttendanceStructProps[] | undefined, month?: string, year?: number): AttendanceStructProps[] => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    var _year = year ? year : currentYear;
    var _month = month ? monthIndices[month as MonthNames] : currentMonth;
    const daysInMonth = new Date(_year, _month, 0).getDate();

    const filledData: AttendanceStructProps[] = [];
    let currentDay = 1;

    if (data === undefined) {
        // Fill all days with 'unfilled' if data is undefined
        while (currentDay <= daysInMonth) {
            filledData.push({ Day: currentDay, Status: 'unfilled' });
            currentDay++;
        }
        return filledData;
    }

    for (const entry of data) {
        while (currentDay < entry.Day) {
            filledData.push({ Day: currentDay, Status: 'unfilled' });
            currentDay++;
        }
        filledData.push(entry);
        currentDay++;
    }

    // Fill remaining days
    while (currentDay <= daysInMonth) {
        filledData.push({ Day: currentDay, Status: 'unfilled' });
        currentDay++;
    }

    return filledData;
}
export const getLast30Days = (): { Date: string, Value: string }[] => {
    const dates: { Date: string, Value: string }[] = [];
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);

    for (let i = 0; i < 15; i++) {
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString(); // No padding
        const day = currentDate.getDate().toString(); // No padding
        const dateStr = `${year}-${month}-${day}`;
        const valueStr = `${currentDate.getDate()} of ${currentDate.toLocaleString('default', { month: 'long' })}`;
        dates.push({ Date: dateStr, Value: valueStr });
        currentDate.setDate(currentDate.getDate() - 1);
    }

    return dates;
}

export const getCompleteWeekDays = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysSinceMonday = (dayOfWeek + 6) % 7; // Days since last Monday (0 for Monday)

    // Calculate the dates
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - daysSinceMonday - 7); // Last Monday

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Following Sunday

    // Collect the dates in an array
    const dates = [];
    for (let d = new Date(startOfWeek); d <= endOfWeek; d.setDate(d.getDate() + 1)) {
        dates.push(new Date(d));
    }

    return dates;
}

// const lastWeekDates = getLastWeekDates();
// const lastWeekDateStrings = lastWeekDates.map(date => date.toISOString().split('T')[0]);

// const filteredSubjects = new Map<string, ISubjectItem[]>();

// user.subjects.forEach((items, subject) => {
//     const filteredItems = items.filter(item => lastWeekDateStrings.includes(new Date(item.Date).toISOString().split('T')[0]));
//     if (filteredItems.length > 0) {
//         filteredSubjects.set(subject, filteredItems);
//     }
// });

// console.log(filteredSubjects);
