import { createReactQueryHooks } from '@trpc/react';
import type { AppRouter } from '@server/router';
import { NextPageContext } from 'next';

/**
 * Extend `NextPageContext` with meta data that can be picked up by `responseMeta()` when server-side rendering
 */
export interface SSRContext extends NextPageContext {
    /**
     * Set HTTP Status code
     * @usage
     * const utils = trpc.useContext();
     * if (utils.ssrContext) {
     *   utils.ssrContext.status = 404;
     * }
     */
    status?: number;
}

export const trpc = createReactQueryHooks<AppRouter>();
