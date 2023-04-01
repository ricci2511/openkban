import type { PublicProvider } from 'next-auth/core/routes/providers';
import { authOptions } from 'pages/api/auth/[...nextauth]';

/**
 * @description Workaround to make `getProviders` from next auth work at build time (SSG)
 * when running a production build locally.
 */
export function getServerProviders(): Record<string, PublicProvider> {
    const baseUrl =
        process.env.NEXTAUTH_URL || `https://${process.env.VERCEL_URL}`;

    return Object.fromEntries(
        authOptions.providers.map(
            ({ id, name, type }): [string, PublicProvider] => [
                id,
                {
                    callbackUrl: new URL(`/api/callback/${id}`, baseUrl).href,
                    id,
                    name,
                    signinUrl: new URL(`/api/signin/${id}`, baseUrl).href,
                    type,
                },
            ]
        )
    );
}
