import { compare, hash } from 'bcryptjs';
import mongoose from 'mongoose';
import { AVATAR_LINK, RolesWithAuthority } from './configs';
import { AttendanceStructProps } from './interfaces';
import { IUserInfo } from './schema/userinfo';
import { IClassInfo } from './schema/classinfo';

export const hashPassword = async (password: string) => {
    const hashedPassword = await hash(password.toString(), 10);
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

export const isAuthorized = (Role: string, Levels: string[]) => {
    const roleDetails = RolesWithAuthority.find(r => r.role === Role);
    if (roleDetails !== undefined)
        return Levels.includes(roleDetails?.authorityLevel);
    else
        return false;
}

export const getImageLink = (Data: string) => {
    if (Data === "default")
        return AVATAR_LINK;
    else
        return Data;
}

export const Connect = async () => {
    if (mongoose.connection.readyState >= 1) return;
    mongoose.connect(process.env.NEXT_PUBLIC_MONGODB_ACCESS!);
}

export const getDate = () => {
    const currentDate = new Date();
    return {
        Month: currentDate.toLocaleString('default', { month: 'long' }),
        Year: currentDate.getFullYear(),
        Day: currentDate.getDate()
    }
}

export const sendRequest = async (address: string, _body: object) => {
    const response = await fetch(address, {
        method: "POST",
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