import { createRouter } from "./context";
import superjson from 'superjson';
import { authRouter } from "./auth-router";

export const appRouter = createRouter()
    .transformer(superjson)
    .merge('auth.', authRouter);

export type AppRouter = typeof appRouter;
