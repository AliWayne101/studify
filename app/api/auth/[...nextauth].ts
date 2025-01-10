import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
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

        // Validate password rehash

        //if not password matched return null
        

        return {
        //   name: user.name,
        //   email: user.email,
        };
      },
    }),
  ],

  secret: process.env.NEXT_PUBLIC_SECRET!,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 Days
  },
});