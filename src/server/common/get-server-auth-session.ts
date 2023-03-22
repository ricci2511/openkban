import type { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions as nextAuthOptions } from 'pages/api/auth/[...nextauth]';

// TODO: get cached session from Redis?
export const getServerAuthSession = async (ctx: {
    req: GetServerSidePropsContext['req'];
    res: GetServerSidePropsContext['res'];
}) => {
    return await getServerSession(ctx.req, ctx.res, nextAuthOptions);
};
