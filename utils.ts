import { compare, hash } from 'bcryptjs';
import mongoose from 'mongoose';

export const hashPassword = async (password: string) => {
    const hashedPassword = await hash(password, 12);
    return hashedPassword;
}

export const isPasswordValid = async (password: string, hashedPassword: string) => {
    const isValid = await compare(password, hashedPassword);
    return isValid;
}

export const UniqueID = (length: number) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export const Connect = async () => {
    if (mongoose.connection.readyState >= 1) return;
    mongoose.connect(process.env.NEXT_PUBLIC_MONGODB_ACCESS!);
}