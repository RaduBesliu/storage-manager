import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const storeChainRouter = createTRPCRouter({
  get: publicProcedure.query(async ({ ctx }) => {
    const storeChains = await ctx.db.storeChain.findMany();
    return storeChains;
  }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1), location: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.storeChain.create({
        data: {
          name: input.name,
          location: input.location,
        },
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1),
        location: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.storeChain.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          location: input.location,
        },
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.storeChain.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
