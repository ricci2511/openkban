import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import { appRouter } from '@server/routers';
import { createContext } from '@server/context';
import superjson from 'superjson';
import * as trpcNext from '@trpc/server/adapters/next';

// ssg helpers to prefetch queries on the server
export const generateSSGHelpers = async (
    opts: trpcNext.CreateNextContextOptions
) => {
    return createProxySSGHelpers({
        router: appRouter,
        ctx: await createContext(opts),
        transformer: superjson,
    });
};
