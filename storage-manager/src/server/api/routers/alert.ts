import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { sendEmail } from "~/utils/email";
import { db } from "~/server/db";
import cron from "node-cron";

cron.schedule("*/5 * * * *", () => {
  console.log("Running stock level check...");
  checkStockLevels()
    .then(() => {
      console.log("Stock level check completed successfully.");
    })
    .catch((error) => {
      console.error("Error checking stock levels:", error);
    });
});

const to = process.env.SENDER_EMAIL ?? "mops@yahoo.com";

async function checkStockLevels() {
  try {
    const activeAlerts = await db.alert.findMany({
      where: { isActive: true },
      include: { Product: true, Store: true, StoreChain: true },
    });

    for (const alert of activeAlerts) {
      const product = await db.product.findUnique({
        where: { id: alert.productId },
      });

      if (!product) {
        console.warn(`Product with ID ${alert.productId} not found`);
        continue;
      }

      if (alert.storeId && product.storeId !== alert.storeId) {
        console.log(
          `Skipping alert for product ${product.name}, storeId does not match`,
        );
        continue;
      }

      if (product.quantity <= alert.threshold) {
        const productName = product.name;
        const storeName =
          alert.Store?.name ?? alert.StoreChain?.name ?? "Unknown Store";

        const emailBody = `
          Stock alert triggered:
          Product: ${productName}
          Store: ${storeName}
          Current Stock: ${product.quantity}
          Threshold: ${alert.threshold}
        `;

        console.log("Sending EMAIL for alert trigger to", to);
        await sendEmail(to, "Stock Alert Triggered", emailBody);
        console.log(`Alert sent for product ${productName}`);
      }
    }
  } catch (error) {
    console.error("Error checking stock levels:", error);
  }
}

export const alertRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        productId: z.number(),
        storeId: z.number().optional(),
        storeChainId: z.number().optional(),
        threshold: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const alert = await ctx.db.alert.create({
        data: {
          productId: input.productId,
          storeId: input.storeId,
          storeChainId: input.storeChainId,
          threshold: input.threshold,
        },
      });
      console.log("Received input for alert creation:", input);

      return { alert, message: "Alert created successfully!" };
    }),

  getActiveAlerts: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.alert.findMany({
      where: { isActive: true },
      include: {
        Product: true,
        Store: true,
        StoreChain: true,
      },
    });
  }),

  toggleAlert: protectedProcedure
    .input(z.object({ alertId: z.number(), isActive: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const alert = await ctx.db.alert.update({
        where: { id: input.alertId },
        data: { isActive: input.isActive },
        include: { Product: true, Store: true, StoreChain: true },
      });

      if (input.isActive) {
        const productName = alert.Product.name;
        const storeName =
          alert.Store?.name ?? alert.StoreChain?.name ?? "Unknown Store";
        const threshold = alert.threshold;

        const emailBody = `
          An alert has been triggered for the following product:
          Product: ${productName}
          Store: ${storeName}
          Threshold: ${threshold}
        `;

        console.log("Sending EMAIL for alert trigger to", to);
        await sendEmail(to, "Stock Alert Triggered", emailBody);
      }

      const message = input.isActive
        ? "Alert activated successfully!"
        : "Alert deactivated successfully!";
      return { alert, message };
    }),

  getAlertHistory: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.alert.findMany({
      where: { isActive: false },
      include: { Product: true, Store: true, StoreChain: true },
      orderBy: { createdAt: "desc" },
    });
  }),
});
