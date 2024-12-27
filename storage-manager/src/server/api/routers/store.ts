import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const storeRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const stores = await ctx.db.store.findMany();
    return stores;
  }),

  getByStoreChainId: protectedProcedure
    .input(z.object({ storeChainId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.store.findMany({
        where: {
          storeChainId: input.storeChainId,
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        location: z.string().min(1),
        storeChainId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.store.create({
        data: {
          name: input.name,
          location: input.location,
          storeChainId: input.storeChainId,
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
      return await ctx.db.store.update({
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
      return await ctx.db.store.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
