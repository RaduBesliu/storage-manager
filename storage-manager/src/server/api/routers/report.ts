import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { addCurrentTimeToDate } from "~/utils/utils";

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
            gte: addCurrentTimeToDate(input.startDate),
            lte: addCurrentTimeToDate(input.endDate),
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
            gte: addCurrentTimeToDate(input.startDate),
            lte: addCurrentTimeToDate(input.endDate),
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
            gte: addCurrentTimeToDate(input.startDate),
            lte: addCurrentTimeToDate(input.endDate),
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
            gte: addCurrentTimeToDate(input.startDate),
            lte: addCurrentTimeToDate(input.endDate),
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
            gte: addCurrentTimeToDate(input.startDate),
            lte: addCurrentTimeToDate(input.endDate),
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

  // New charts

  getLowStockAlerts: protectedProcedure
    .input(
      z.object({
        storeChainId: z.number().nullable(),
        storeId: z.number().nullable(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const alerts = await ctx.db.alert.findMany({
        where: {
          storeId: input.storeId ?? undefined,
          Store: {
            storeChainId: input.storeChainId ?? undefined,
          },
        },
        include: {
          Product: true,
        },
        orderBy: {
          createdAt: "asc", // Ensures chronological order
        },
      });

      // Group alerts by Product.category
      const groupedAlerts = alerts.reduce(
        (acc: Record<string, typeof alerts>, alert) => {
          const category = alert.Product.category;
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(alert);
          return acc;
        },
        {},
      );

      return groupedAlerts;
    }),

  getSalesRevenueTrends: protectedProcedure
    .input(
      z.object({
        storeChainId: z.number().nullable(),
        storeId: z.number().nullable(),
        startDate: z.date(),
        endDate: z.date(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.sale.groupBy({
        by: ["saleDate"],
        where: {
          saleDate: {
            gte: addCurrentTimeToDate(input.startDate),
            lte: addCurrentTimeToDate(input.endDate),
          },
          Store: {
            storeChainId: input.storeChainId ?? undefined,
            id: input.storeId ?? undefined,
          },
        },
        _sum: {
          totalPrice: true,
        },
        orderBy: {
          saleDate: "asc", // Ensures chronological order
        },
      });
    }),

  getPriceChangeImpact: protectedProcedure
    .input(
      z.object({
        storeChainId: z.number().nullable(),
        storeId: z.number().nullable(),
        startDate: z.date(),
        endDate: z.date(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.priceChange.groupBy({
        by: ["reason"],
        where: {
          changeDate: {
            gte: addCurrentTimeToDate(input.startDate),
            lte: addCurrentTimeToDate(input.endDate),
          },
          Store: {
            storeChainId: input.storeChainId ?? undefined,
            id: input.storeId ?? undefined,
          },
        },
        _count: {
          _all: true,
        },
      });
    }),

  getProductReturnRates: protectedProcedure
    .input(
      z.object({
        storeChainId: z.number().nullable(),
        storeId: z.number().nullable(),
        startDate: z.date(),
        endDate: z.date(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const returns = await ctx.db.return.groupBy({
        by: ["productId"],
        where: {
          returnDate: {
            gte: addCurrentTimeToDate(input.startDate),
            lte: addCurrentTimeToDate(input.endDate),
          },
          Store: {
            storeChainId: input.storeChainId ?? undefined,
            id: input.storeId ?? undefined,
          },
        },
        _sum: {
          quantity: true,
        },
      });

      const sales = await ctx.db.sale.groupBy({
        by: ["productId"],
        where: {
          saleDate: {
            gte: addCurrentTimeToDate(input.startDate),
            lte: addCurrentTimeToDate(input.endDate),
          },
          Store: {
            storeChainId: input.storeChainId ?? undefined,
            id: input.storeId ?? undefined,
          },
        },
        _sum: {
          quantity: true,
        },
      });

      const productIds = [
        ...new Set([
          ...returns.map((r) => r.productId),
          ...sales.map((s) => s.productId),
        ]),
      ];
      const products = await ctx.db.product.findMany({
        where: {
          id: { in: productIds },
        },
        select: {
          id: true,
          name: true,
        },
      });

      const productMap = Object.fromEntries(
        products.map((p) => [p.id, p.name]),
      );
      const salesMap = Object.fromEntries(
        sales.map((s) => [s.productId, s._sum.quantity ?? 0]),
      );

      return returns.map((r) => ({
        productId: r.productId,
        productName: productMap[r.productId] ?? "Unknown",
        returnedQuantity: r._sum.quantity ?? 0,
        returnRate: (r._sum.quantity ?? 0) / (salesMap[r.productId] ?? 1),
        totalSold: salesMap[r.productId] ?? 0,
      }));
    }),
});
