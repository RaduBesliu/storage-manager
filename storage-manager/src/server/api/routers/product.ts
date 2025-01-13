import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { Event } from "~/utils/types";

export const productRouter = createTRPCRouter({
  get: protectedProcedure
    .input(
      z.object({
        storeId: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const products = await ctx.db.product.findMany({
        include: {
          Store: true,
        },
        where: input.storeId ? { storeId: input.storeId } : undefined,
        orderBy: [
          {
            Store: {
              id: "asc", // Sort by store name in ascending order
            },
          },
          {
            name: "asc", // Sort by product name in ascending order
          },
        ],
      });
      return products;
    }),

  getInfinite: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).optional().default(10),
        cursor: z.number().nullish(),
        storeId: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const products = await ctx.db.product.findMany({
        include: {
          Store: true,
        },
        take: input.limit + 1, // Fetch one extra item to check if there's a next page
        skip: input.cursor ? 1 : 0, // Skip the first item if there's a cursor
        cursor: input.cursor ? { id: input.cursor } : undefined,
        where: input.storeId ? { storeId: input.storeId } : undefined,
        orderBy: [
          {
            Store: {
              id: "asc", // Sort by store name in ascending order
            },
          },
          {
            name: "asc", // Sort by product name in ascending order
          },
        ],
      });

      let nextCursor: typeof input.cursor = undefined;
      if (products.length > input.limit) {
        const lastProduct = products.pop();
        nextCursor = lastProduct?.id ?? null;
      }

      return { items: products, nextCursor };
    }),

  getByStoreId: protectedProcedure
    .input(z.object({ storeId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.product.findMany({
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
      return await ctx.db.product.create({
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
        details: z.string().optional().default(""),
        operationType: z.nativeEnum(Event),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const product = await ctx.db.product.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!product) {
        throw new Error("Product not found");
      }

      if (product?.price !== input.price) {
        await ctx.db.priceChange.create({
          data: {
            productId: input.id,
            oldPrice: product.price,
            newPrice: input.price,
            reason: input.details,
            storeId: input.storeId,
          },
        });
      }

      if (product?.quantity < input.quantity) {
        // sale or adjustment
        if (input.operationType === Event.SALE) {
          await ctx.db.sale.create({
            data: {
              productId: input.id,
              quantity: input.quantity - product.quantity,
              totalPrice: (input.quantity - product.quantity) * product.price,
              storeId: input.storeId,
            },
          });
        } else {
          await ctx.db.adjustment.create({
            data: {
              productId: input.id,
              quantity: product.quantity - input.quantity,
              reason: input.details,
              storeId: input.storeId,
            },
          });
        }
      } else if (product?.quantity > input.quantity) {
        // return or restock
        if (input.operationType === Event.RESTOCK) {
          await ctx.db.restock.create({
            data: {
              productId: input.id,
              quantity: product.quantity - input.quantity,
              storeId: input.storeId,
              supplier: input.details,
            },
          });
        } else {
          await ctx.db.return.create({
            data: {
              productId: input.id,
              quantity: product.quantity - input.quantity,
              reason: input.details,
              storeId: input.storeId,
            },
          });
        }
      }

      return await ctx.db.product.update({
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
      return await ctx.db.product.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
