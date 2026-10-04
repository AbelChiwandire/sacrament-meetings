import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      // Protect all create and edit routes
      const isProtected = nextUrl.pathname.endsWith('/new') || nextUrl.pathname.endsWith('/edit');

      if (isProtected) {
        if (isLoggedIn) return true;
        return false; // redirects to /login
      }

      // Redirect already-logged-in users away from the login page
      if (isLoggedIn && nextUrl.pathname === '/login') {
        return Response.redirect(new URL('/meetings', nextUrl));
      }

      return true;
    },
  },
  providers: [], // providers are added in auth.ts
} satisfies NextAuthConfig;