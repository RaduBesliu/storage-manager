import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const reportRouter = createTRPCRouter({
  getSaleReport: protectedProcedure
    .input(
      z.object({
        storeChainId: z.number(),
        storeId: z.number(),
        productId: z.number(),
        startDate: z.date(),
        endDate: z.date(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.sale.findMany({
        where: {
          storeId: input.storeId,
          productId: input.productId,
          saleDate: {
            gte: input.startDate,
            lte: input.endDate,
          },
          Store: {
            storeChainId: input.storeChainId,
          },
        },
        include: {
          Store: true,
        },
      });
    }),

  getRestockReport: protectedProcedure
    .input(
      z.object({
        storeChainId: z.number(),
        storeId: z.number(),
        productId: z.number(),
        startDate: z.date(),
        endDate: z.date(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.restock.findMany({
        where: {
          storeId: input.storeId,
          productId: input.productId,
          restockDate: {
            gte: input.startDate,
            lte: input.endDate,
          },
          Store: {
            storeChainId: input.storeChainId,
          },
        },
        include: {
          Store: true,
        },
      });
    }),

  getReturnReport: protectedProcedure
    .input(
      z.object({
        storeChainId: z.number(),
        storeId: z.number(),
        productId: z.number(),
        startDate: z.date(),
        endDate: z.date(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.return.findMany({
        where: {
          storeId: input.storeId,
          productId: input.productId,
          returnDate: {
            gte: input.startDate,
            lte: input.endDate,
          },
          Store: {
            storeChainId: input.storeChainId,
          },
        },
        include: {
          Store: true,
        },
      });
    }),

  getPriceChangeReport: protectedProcedure
    .input(
      z.object({
        storeChainId: z.number(),
        storeId: z.number(),
        productId: z.number(),
        startDate: z.date(),
        endDate: z.date(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.priceChange.findMany({
        where: {
          storeId: input.storeId,
          productId: input.productId,
          changeDate: {
            gte: input.startDate,
            lte: input.endDate,
          },
          Store: {
            storeChainId: input.storeChainId,
          },
        },
        include: {
          Store: true,
        },
      });
    }),

  getAdjustmentReport: protectedProcedure
    .input(
      z.object({
        storeChainId: z.number(),
        storeId: z.number(),
        productId: z.number(),
        startDate: z.date(),
        endDate: z.date(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.adjustment.findMany({
        where: {
          storeId: input.storeId,
          productId: input.productId,
          adjustmentDate: {
            gte: input.startDate,
            lte: input.endDate,
          },
          Store: {
            storeChainId: input.storeChainId,
          },
        },
        include: {
          Store: true,
        },
      });
    }),
});
