// import { NextResponse } from 'next/server';
// import { getToken } from 'next-auth/jwt';
// import type { NextRequest } from 'next/server';
// import { useSession } from 'next-auth/react';

// export async function middleware(request: NextRequest) {
// //   const session = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
//   const { data: session } = useSession();
//   if (request.nextUrl.pathname.startsWith('/dashboard')) {
//     if (!session) {
//       return NextResponse.redirect(new URL('/login', request.url));
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: '/dashboard',
// };
