import { SESSION_AGE } from "@/configs";
import UserModel from "@/schema/userinfo";
import { Connect, isPasswordValid } from "@/utils";
import { AuthOptions, DefaultSession, getServerSession } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import { signOut } from "next-auth/react";

declare module "next-auth" {
    interface Session {
        user: {
            name:string;
            uid: string;
            role: string;
            accountType: string;
            image: string;
            schoolName: string;
        } & DefaultSession["user"];
    }

    interface User {
        name:string;
        uid: string;
        role: string;
        accountType: string;
        image: string;
        schoolName: string;
    }
}

const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            //@ts-ignore
            async authorize(credentials: any) {
                // Check user exists
                await Connect();
                const user = await UserModel.findOne({ UID: credentials.email }).exec();
                if (!user) {
                    return null;
                }

                // Check password match
                const isValid = isPasswordValid(credentials.password, user.Password);
                if (!isValid) {
                    return null;
                }

                return {
                    uid: user.UID,
                    name: user.Name,
                    role: user.Role,
                    accountType: user.AccountType,
                    schoolName: user.SchoolName,
                    image: user.Image // Assuming user schema has Image field
                };
            },
        }),
    ],
    session: {
        strategy: 'jwt',
        maxAge: SESSION_AGE
    },
    secret: process.env.NEXT_PUBLIC_SECRET!,
    callbacks: {
        async session({ session, token }) {
            if (session.user) {
                session.user.uid = token.uid as string;
                session.user.role = token.role as string;
                session.user.accountType = token.accountType as string;
                session.user.image = token.image as string;
                session.user.schoolName = token.schoolName as string;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.uid = user.uid;
                token.name = user.name;
                token.role = user.role;
                token.accountType = user.accountType;
                token.image = user.image;
                token.schoolName = user.schoolName;
            }
            return token;
        }
    }
}

const getSession = () => getServerSession(authOptions);

const SignOut = async () => {
    await signOut({ callbackUrl: '/login' });
};

export { authOptions, getSession, SignOut }