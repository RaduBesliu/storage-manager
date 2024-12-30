import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const stockRouter = createTRPCRouter({
  getStock: protectedProcedure
    .input(
      z.object({
        productId: z.number().optional(),
        storeId: z.number().optional(),
        storeChainId: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const stock = await ctx.db.product.findMany({
        where: {
          id: input.productId,
          storeId: input.storeId,
          Store: {
            storeChainId: input.storeChainId,
          },
        },
        include: {
          Store: {
            include: {
              StoreChain: true,
            },
          },
        },
      });

      return stock.map((item) => ({
        id: item.id,
        productName: item.name,
        category: item.category,
        quantity: item.quantity,
        price: item.price,
        storeName: item.Store?.name || "-",
        storeChainName: item.Store?.StoreChain?.name || "-",
      }));
    }),
});
