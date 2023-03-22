import NextAuth, { type NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@server/db/client';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import { env } from '../../../env/server.mjs';

export const authOptions: NextAuthOptions = {
    // Include user.id on session
    callbacks: {
        // TODO: cache session in Redis? Will look into Upstash adapter
        session({ session, user }) {
            if (session.user) {
                session.user.id = user.id;
            }
            return session;
        },
    },
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
        }),
        GithubProvider({
            clientId: env.GITHUB_ID,
            clientSecret: env.GITHUB_SECRET,
        }),
        /**
         * TODO: Email provider.
         */
    ],
    pages: {
        signIn: '/auth/signin',
    },
};

export default NextAuth(authOptions);
