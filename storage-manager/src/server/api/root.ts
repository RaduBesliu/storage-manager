import { productRouter } from "~/server/api/routers/product";
import { storeRouter } from "~/server/api/routers/store";
import { storeChainRouter } from "~/server/api/routers/storeChain";
import { userRouter } from "~/server/api/routers/user";
import { reportRouter } from "~/server/api/routers/report";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { stockRouter } from "./routers/stock";
import { alertRouter } from "./routers/alert";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  product: productRouter,
  store: storeRouter,
  storeChain: storeChainRouter,
  user: userRouter,
  report: reportRouter,
  stock: stockRouter,
  alert: alertRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
