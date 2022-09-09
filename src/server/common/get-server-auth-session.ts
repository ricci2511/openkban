/**
 * Wrapper for unstable_getServerSession https://next-auth.js.org/configuration/nextjs
 * Taken straight from the great create-t3-app template
 * https://github.com/t3-oss/create-t3-app
 * Even though it includes "unstable" it is perfectly fine to use
 */

import type { GetServerSidePropsContext } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { authOptions as nextAuthOptions } from 'pages/api/auth/[...nextauth]';

export const getServerAuthSession = async (ctx: {
    req: GetServerSidePropsContext['req'];
    res: GetServerSidePropsContext['res'];
}) => {
    return await unstable_getServerSession(ctx.req, ctx.res, nextAuthOptions);
};
