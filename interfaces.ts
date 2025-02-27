import { Session } from "next-auth";
import { IUserInfo } from "./schema/userinfo";
import { IAttendanceInfo } from "./schema/attendanceinfo";
import { IClassInfo } from "./schema/classinfo";
import React from "react";
import { IDiaryInfo } from "./schema/diaryinfo";

export interface ButtonProps {
    onClick: () => void;
    Disabled?: boolean;
    SingleUse?: boolean;
    children: React.ReactNode;
}

export interface childrenProps {
    children: React.ReactNode;
}

export interface StructProps {
    children: React.ReactNode;
    LoadingCompleted?: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ErrorInterface {
    error: string | null
}

export interface RoleProps {
    Role: string
}

export interface SessionProps {
    session: Session | null;
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
    isProtected?: boolean;
    ProtectionLevel?: string[];
    IsVisible?: boolean;
    Description?: string;
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

export interface ClasswiseStudents {
    Class: string,
    Students: IUserInfo[]
}

export interface UpdateParentInterface {
    Students: ClasswiseStudents[],
    Parents: IUserInfo[]
}

export interface UnassignedStudentsProps {
    Students: IUserInfo[],
    Classes: IClassInfo[]
}

export interface DiaryDetail {
    Subject: string,
    Diary: string,
}

export interface TeacherClass {
    TeacherName: string,
    Class: string,
    UID: string,
    Subject?: string
}

export interface UserDiary {
    User: IUserInfo,
    Diary?: IDiaryInfo | null | undefined
}

export interface CompleteUserData {
    User: IUserInfo | undefined | null,
    Attendance: IAttendanceInfo | undefined | null,
    Children: IUserInfo[],
    Guardians: IUserInfo[],
    Class: IClassInfo | undefined | null,
    Teacher: IUserInfo | undefined | null
}

export interface ISubjectItem {
    ObtainedMarks: number,
    TotalMarks: number,
    Date: Date,
    Position: number
}