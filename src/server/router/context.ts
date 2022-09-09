import { getServerAuthSession } from '@server/common/get-server-auth-session';
import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { Session } from 'next-auth';
import { prisma } from 'server/db/client';

type CreateContextOptions = {
    session: Session | null;
};

// Make current auth session and our prisma client available for all our routers.
export const createContextInner = async (opts: CreateContextOptions) => {
    return {
        session: opts.session,
        prisma,
    };
};

export const createContext = async (
    opts: trpcNext.CreateNextContextOptions
) => {
    const { req, res } = opts;

    const session = await getServerAuthSession({ req, res });

    return await createContextInner({
        session,
    });
};

type Context = trpc.inferAsyncReturnType<typeof createContext>;
export const createRouter = () => trpc.router<Context>();
