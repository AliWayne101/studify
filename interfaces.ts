import { Session } from "next-auth";
import { IUserInfo } from "./schema/userinfo";
import { IAttendanceInfo } from "./schema/attendanceinfo";
import { IClassInfo } from "./schema/classinfo";

export interface ButtonProps {
    onClick: () => void;
    Disabled?: boolean;
    children: React.ReactNode;
}

export interface childrenProps {
    children: React.ReactNode;
}

export interface RoleProps {
    Role: string
}

export interface SessionProps {
    session: Session;
}

export interface BasicInfoProps {
    Title: string;
    Info: String;
}

export interface AttendanceStructProps {
    Day: number;
    Status: string;
}

export interface MenuLinks {
    text: string;
    url: string;
    isProtected?: boolean
}

export interface SlugProps {
    params: Promise<{ slug: string}>
}

export interface ListProps {
    Title: string;
    List?: IUserInfo[];
}

export interface ProperUserInterface {
    User: IUserInfo;
    Parent?: IUserInfo|null;
    Attendance?: IAttendanceInfo|null;
    Class?: IClassInfo|null;
}

export interface SubjectDetail {
    SubjectName: string;
    SubjectTeacherUID: string;
}