import { compare, hash } from 'bcryptjs';
import mongoose from 'mongoose';
import { AVATAR_LINK, RolesWithAuthority } from './configs';

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