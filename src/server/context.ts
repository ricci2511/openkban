import { getServerAuthSession } from '@server/common/get-server-auth-session';
import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { prisma } from 'server/db/client';
import { connect } from './redis';

export const createContext = async (
    opts?: trpcNext.CreateNextContextOptions
) => {
    const req = opts?.req;
    const res = opts?.res;

    const session = req && res && (await getServerAuthSession({ req, res }));

    // connect to redis if not already connected
    await connect();

    return { req, res, session, prisma };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
