import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const storeChainRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const storeChains = await ctx.db.storeChain.findMany();
    return storeChains;
  }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1), location: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.storeChain.create({
        data: {
          name: input.name,
          location: input.location,
          createdById: ctx.session.user.id,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1),
        location: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.storeChain.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          location: input.location,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.storeChain.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
