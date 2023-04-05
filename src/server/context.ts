import { getServerAuthSession } from '@server/common/get-server-auth-session';
import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { prisma } from 'server/db/client';
import { type Session } from 'next-auth';

type CreateContextOptions = {
    session: Session | null;
};

export const createInnerTRPCContext = (opts: CreateContextOptions) => {
    return {
        session: opts.session,
        prisma,
    };
};

/**
 * Used to process every request that goes through a tRPC endpoint.
 * @see https://trpc.io/docs/context
 */
export const createContext = async (
    opts: trpcNext.CreateNextContextOptions
) => {
    const { req, res } = opts;

    const session = await getServerAuthSession({ req, res });
    const contextInner = createInnerTRPCContext({
        session,
    });

    return {
        ...contextInner,
        req,
        res,
    };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
