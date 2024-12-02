import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const storeRouter = createTRPCRouter({
  get: publicProcedure.query(async ({ ctx }) => {
    const stores = await ctx.db.store.findMany();
    return stores;
  }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        location: z.string().min(1),
        storeChainId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.store.create({
        data: {
          name: input.name,
          location: input.location,
          storeChainId: input.storeChainId,
        },
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.store.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
