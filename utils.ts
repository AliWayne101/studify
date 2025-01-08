import { compare, hash } from 'bcryptjs';
import mongoose from 'mongoose';

export const hashPassword = async (password: string) => {
    const hashedPassword = await hash(password, process.env.NEXT_PUBLIC_SALT_LENGTH!);
    return hashedPassword;
}

export const isPasswordValid = async ({ password, hashedPassword }: ({ password: string, hashedPassword: string })) => {
    const isValid = await compare(password, hashedPassword);
    return isValid;
}

export const Connect = async () => {
    if (mongoose.connection.readyState >= 1) return;
    mongoose.connect(process.env.NEXT_PUBLIC_MONGODB_ACCESS!);
}