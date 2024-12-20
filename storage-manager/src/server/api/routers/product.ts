import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const productRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const products = await ctx.db.product.findMany();
    return products;
  }),

  getByStoreId: protectedProcedure
    .input(z.object({ storeId: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.product.findMany({
        where: {
          storeId: input.storeId,
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        category: z.string().min(1),
        description: z.string().optional().default(""),
        price: z.number(),
        quantity: z.number(),
        storeId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.product.create({
        data: {
          name: input.name,
          category: input.category,
          description: input.description,
          price: input.price,
          quantity: input.quantity,
          storeId: input.storeId,
        },
      });
    }),

  edit: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1),
        category: z.string().min(1),
        description: z.string().optional().default(""),
        price: z.number(),
        quantity: z.number(),
        storeId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.product.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          category: input.category,
          description: input.description,
          price: input.price,
          quantity: input.quantity,
          storeId: input.storeId,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.product.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
