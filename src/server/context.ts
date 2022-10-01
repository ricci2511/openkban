import { getServerAuthSession } from '@server/common/get-server-auth-session';
import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { prisma } from 'server/db/client';

export const createContext = async (
    opts: trpcNext.CreateNextContextOptions
) => {
    const { req, res } = opts;

    const session = await getServerAuthSession({ req, res });

    return { req, res, session, prisma };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
