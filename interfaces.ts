import { Session } from "next-auth";
import { IStudentCard } from "./schema/studentcard";
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

export interface ListProps {
    Title: string;
    Target: string;
    List: IStudentCard[]|IUserInfo[];
}