import { compare, hash } from 'bcryptjs';

export const hashPassword = async (password: string) => {
    const hashedPassword = await hash(password, process.env.SALT_LENGTH!);
    return hashedPassword;
}

export const isPasswordValid = async ({ password, hashedPassword }: ({ password: string, hashedPassword: string })) => {
    const isValid = await compare(password, hashedPassword);
    return isValid;
}