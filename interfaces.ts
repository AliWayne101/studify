import { Session } from "next-auth";
import { IUserInfo } from "./schema/userinfo";

export interface ButtonProps {
    onClick: () => void;
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

export interface ListProps {
    Title: string;
    List?: IUserInfo[];
}