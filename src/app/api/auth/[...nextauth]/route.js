// // src/app/api/auth/[...nextauth]/route.js

// import  prisma  from '@/lib/prisma';
// import { compare } from 'bcryptjs';
// import NextAuth from 'next-auth';
// import CredentialsProvider from 'next-auth/providers/credentials';

// export const authOptions = {
//   secret: process.env.NEXTAUTH_SECRET,
//   providers: [
//     CredentialsProvider({
//       name: 'Credentials',
//       credentials: {
//         email: { label: 'Email', type: 'email' },
//         password: { label: 'Password', type: 'password' },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           return null;
//         }
        
//          let user = await prisma.user.findUnique({
//             where: { email: credentials.email },
//           });
          
//           if (!user) {
//             return null;
//           }
     
        
//         const isPasswordValid = await compare(credentials.password, user.password);
        
        
//         if (!isPasswordValid) {
//           return null;
//         }
        
//         return {
//           id: user.id,
//           email: user.email,
//           name: user.name,
//           role: user.role,
//         };
//       }
//     }),
//   ],
//   callbacks: {
//     jwt: async ({ token, user }) => {
     
//       if (user) {
//         token.role = user.role;
//         token.id = user.id;
//       }
//       return token;
//     },
//     session: async ({ session, token }) => {
//       console.log("Session callback received:", { sessionExists: !!session, tokenExists: !!token });
//       if (session?.user) {
//         session.user.role = token.role;
//         session.user.id = token.id;
//       }
//       return session;
//     },
//   },
//   pages: {
//     signIn: '/auth/signin',
//     signOut: '/auth/signout',
//   },
//   session: {
//     strategy: 'jwt',
//     maxAge: 6,
//   },
// };

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };


// src/app/api/auth/[...nextauth]/route.js

import prisma from '@/lib/prisma';
import { compare } from 'bcryptjs';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from "@auth/prisma-adapter";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        
        if (!user) {
          return null;
        }
        
        const isPasswordValid = await compare(credentials.password, user.password);
        
        if (!isPasswordValid) {
          return null;
        }
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          // Add a timestamp for fresh validation
          sessionValidatedAt: Date.now()
        };
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      // Initial sign in or when token is being created
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.sessionValidatedAt = Date.now();
      }
      
      // Add a forced database check on every token refresh
      if (token?.id && trigger === "update") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { id: token.id }
          });
          
          if (!existingUser) {
            console.log(`User ${token.id} not found in database, invalidating token`);
            return {};  // Return empty token to force sign out
          }
          
          // Update validation timestamp
          token.sessionValidatedAt = Date.now();
        } catch (error) {
          console.error('Error verifying user in JWT callback:', error);
          return {};  // Return empty token on error
        }
      }
      
      // Check if more than 5 minutes have passed since last validation
      const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
      if (!token?.sessionValidatedAt || token.sessionValidatedAt < fiveMinutesAgo) {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { id: token.id }
          });
          
          if (!existingUser) {
            console.log(`User ${token.id} periodic check failed, invalidating token`);
            return {};  // Return empty token
          }
          
          // Update validation timestamp
          token.sessionValidatedAt = Date.now();
        } catch (error) {
          console.error('Error in periodic user validation:', error);
          return {};  // Return empty token on error
        }
      }
      
      return token;
    },
    
    async session({ session, token }) {
      if (token && Object.keys(token).length > 0 && token.id) {
        try {
          // Perform one final check that user exists
          const existingUser = await prisma.user.findUnique({
            where: { id: token.id }
          });
          
          if (!existingUser) {
            console.log(`User ${token.id} not found during session creation`);
            return null;  // Return null session
          }
          
          session.user = {
            id: token.id,
            email: token.email,
            name: token.name,
            role: token.role
          };
          
          return session;
        } catch (error) {
          console.error('Error in session callback:', error);
          return null;  // Return null session on error
        }
      }
      
      // If token is empty or has no id, return null session
      return null;
    },
  },
  events: {
    async signOut(message) {
      console.log('User signed out', message);
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 1 day
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };