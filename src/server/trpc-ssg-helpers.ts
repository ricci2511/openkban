import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import { appRouter } from '@server/router';
import { createContext } from '@server/context';
import superjson from 'superjson';
import * as trpcNext from '@trpc/server/adapters/next';

// ssg helpers to prefetch queries on the server
export const getSSGHelpers = async (
    opts?: trpcNext.CreateNextContextOptions
) => {
    return createProxySSGHelpers({
        router: appRouter,
        ctx: await createContext(opts),
        transformer: superjson,
    });
};
