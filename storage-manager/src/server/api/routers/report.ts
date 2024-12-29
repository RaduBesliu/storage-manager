import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const reportRouter = createTRPCRouter({
  getSaleReport: protectedProcedure
    .input(
      z.object({
        storeChainId: z.number().nullable(),
        storeId: z.number().nullable(),
        productId: z.number().nullable(),
        startDate: z.date(),
        endDate: z.date(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.sale.findMany({
        where: {
          productId: input.productId ?? undefined,
          saleDate: {
            gte: input.startDate,
            lte: input.endDate,
          },
          Store: {
            storeChainId: input.storeChainId ?? undefined,
            id: input.storeId ?? undefined,
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
        storeChainId: z.number().nullable(),
        storeId: z.number().nullable(),
        productId: z.number().nullable(),
        startDate: z.date(),
        endDate: z.date(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.restock.findMany({
        where: {
          storeId: input.storeId ?? undefined,
          productId: input.productId ?? undefined,
          restockDate: {
            gte: input.startDate,
            lte: input.endDate,
          },
          Store: {
            storeChainId: input.storeChainId ?? undefined,
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
        storeChainId: z.number().nullable(),
        storeId: z.number().nullable(),
        productId: z.number().nullable(),
        startDate: z.date(),
        endDate: z.date(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.return.findMany({
        where: {
          storeId: input.storeId ?? undefined,
          productId: input.productId ?? undefined,
          returnDate: {
            gte: input.startDate,
            lte: input.endDate,
          },
          Store: {
            storeChainId: input.storeChainId ?? undefined,
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
        storeChainId: z.number().nullable(),
        storeId: z.number().nullable(),
        productId: z.number().nullable(),
        startDate: z.date(),
        endDate: z.date(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.priceChange.findMany({
        where: {
          storeId: input.storeId ?? undefined,
          productId: input.productId ?? undefined,
          changeDate: {
            gte: input.startDate,
            lte: input.endDate,
          },
          Store: {
            storeChainId: input.storeChainId ?? undefined,
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
        storeChainId: z.number().nullable(),
        storeId: z.number().nullable(),
        productId: z.number().nullable(),
        startDate: z.date(),
        endDate: z.date(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.adjustment.findMany({
        where: {
          storeId: input.storeId ?? undefined,
          productId: input.productId ?? undefined,
          adjustmentDate: {
            gte: input.startDate,
            lte: input.endDate,
          },
          Store: {
            storeChainId: input.storeChainId ?? undefined,
          },
        },
        include: {
          Store: true,
        },
      });
    }),
});
