import { SESSION_AGE } from '@/configs';
import UserModel from '@/schema/userinfo';
import { Connect, isPasswordValid } from '@/utils';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  pages: {
    signIn: '/',
  },
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      //@ts-ignore
      async authorize(credentials: any) {
        // Check user exists
        await Connect();
        const user = await UserModel.findOne({ email: credentials.email }).exec();
        if (!user) {
          return null;
        }

        // Check password match
        const isValid = isPasswordValid(credentials.password, user.Password);
        if (!isValid) {
          return null;
        }

        return {
          name: user.Name,
          email: user.Email,
          account: user.AccountType
        };
      },
    }),
  ],

  secret: process.env.NEXT_PUBLIC_SECRET!,
  session: {
    strategy: 'jwt',
    maxAge: SESSION_AGE
  },
});

export { handler as GET, handler as POST };