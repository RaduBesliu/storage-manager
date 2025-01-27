import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { randomInt } from "crypto";

const prisma = new PrismaClient();

async function main() {
  console.log("Clearing database...");

  // Clear existing data
  await prisma.sale.deleteMany();
  await prisma.restock.deleteMany();
  await prisma.return.deleteMany();
  await prisma.priceChange.deleteMany();
  await prisma.adjustment.deleteMany();
  await prisma.alert.deleteMany();

  await prisma.product.deleteMany();
  await prisma.store.deleteMany();
  await prisma.storeChain.deleteMany();
  await prisma.user.deleteMany();

  await prisma.$executeRaw`TRUNCATE TABLE "Sale", "Restock", "Return", "PriceChange", "Adjustment", "Alert", "Product", "Store", "StoreChain", "User" RESTART IDENTITY CASCADE`;

  console.log("Seeding database...");

  // Create users
  const superAdmin = await prisma.user.create({
    data: {
      name: "Super Admin",
      email: "superadmin@gmail.com",
      password: bcrypt.hashSync("superadmin", 10),
      role: "SUPER_ADMIN",
      storeId: null,
      emailVerified: new Date(),
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const storeAdmin = await prisma.user.create({
    data: {
      name: "Store Admin",
      email: "storeadmin@gmail.com",
      password: bcrypt.hashSync("storeadmin", 10),
      role: "STORE_ADMIN",
      storeId: 1,
      emailVerified: new Date(),
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const employee = await prisma.user.create({
    data: {
      name: "Employee",
      email: "employee@gmail.com",
      password: bcrypt.hashSync("employee", 10),
      role: "STORE_EMPLOYEE",
      storeId: 1,
      emailVerified: new Date(),
    },
  });

  const storeChains = [
    {
      name: "Lidl",
      location: "Bucharest",
    },
    {
      name: "Kaufland",
      location: "Bucharest",
    },
    {
      name: "Auchan",
      location: "Bucharest",
    },
    {
      name: "Mega Image",
      location: "Bucharest",
    },
  ];

  const bucharestLocations = [
    "Sector 1 - Aviatorilor",
    "Sector 2 - Obor",
    "Sector 3 - Dristor",
    "Sector 4 - Tineretului",
    "Sector 5 - Cotroceni",
    "Sector 6 - Militari",
  ];

  const products = [
    {
      name: "Milk",
      category: "Dairy",
      description: "Fresh milk 1L",
      price: 4.5,
      quantity: 100,
    },
    {
      name: "Bread",
      category: "Bakery",
      description: "Whole wheat bread",
      price: 3.0,
      quantity: 200,
    },
    {
      name: "Butter",
      category: "Dairy",
      description: "Unsalted butter 250g",
      price: 6.0,
      quantity: 50,
    },
    {
      name: "Eggs",
      category: "Poultry",
      description: "Pack of 10 eggs",
      price: 10.0,
      quantity: 80,
    },
    {
      name: "Apples",
      category: "Fruits",
      description: "1kg of red apples",
      price: 7.5,
      quantity: 150,
    },
    {
      name: "Chicken Breast",
      category: "Meat",
      description: "Fresh chicken breast 500g",
      price: 15.0,
      quantity: 70,
    },
    {
      name: "Cola",
      category: "Drinks",
      description: "2L Cola bottle",
      price: 6.5,
      quantity: 120,
    },
    {
      name: "Orange Juice",
      category: "Drinks",
      description: "1L fresh orange juice",
      price: 8.5,
      quantity: 100,
    },
    {
      name: "Pasta",
      category: "Grains",
      description: "500g Italian pasta",
      price: 5.0,
      quantity: 90,
    },
    {
      name: "Cheese",
      category: "Dairy",
      description: "Cheddar cheese 200g",
      price: 12.0,
      quantity: 60,
    },
    {
      name: "Canned Beans",
      category: "Canned Goods",
      description: "Canned beans 400g",
      price: 2.5,
      quantity: 200,
    },
    {
      name: "Potatoes",
      category: "Vegetables",
      description: "2kg bag of potatoes",
      price: 4.0,
      quantity: 150,
    },
  ];

  const returnReasons = [
    "Customer return",
    "Defective product",
    "Damaged goods",
    "Wrong item received",
    "Size/color mismatch",
    "Quality issue",
    "Ordered by mistake",
  ];

  const priceChangeReasons = [
    "Seasonal discount",
    "Promotional price change",
    "Supplier price change",
    "Price error correction",
    "Market fluctuation",
    "Price optimization",
  ];

  const adjustmentReasons = [
    "Inventory audit",
    "Stock correction",
    "Overstock clearance",
    "Product expiration",
    "Internal error adjustment",
    "Supplier stock discrepancy",
  ];

  for (const chain of storeChains) {
    // Create store chains
    const createdChain = await prisma.storeChain.create({
      data: {
        name: chain.name,
        location: chain.location,
        createdBy: { connect: { id: superAdmin.id } },
      },
    });

    // Create stores for each chain
    for (let i = 0; i < 4; i++) {
      const location = bucharestLocations[i % bucharestLocations.length];
      const store = await prisma.store.create({
        data: {
          name: `${chain.name} - ${location}`,
          location: location ?? "Bucharest",
          createdBy: { connect: { id: superAdmin.id } },
          StoreChain: { connect: { id: createdChain.id } },
        },
      });

      // Add products to the store
      for (const product of products) {
        const createdProduct = await prisma.product.create({
          data: {
            ...product,
            storeId: store.id,
          },
        });

        let lastPrice = createdProduct.price;
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - 365); // Start one year ago

        // Create 20 entries for each product event
        for (let i = 0; i < 20; i++) {
          // Increment the date by a realistic number of days (e.g., 5 to 20 days between events)
          const daysToAdd = randomInt(0, 15) + 5;
          currentDate.setDate(currentDate.getDate() + daysToAdd);

          const quantityChange = randomInt(0, 20) + 1;

          // Sale
          await prisma.sale.create({
            data: {
              productId: createdProduct.id,
              quantity: quantityChange,
              totalPrice: parseFloat((lastPrice * quantityChange).toFixed(2)),
              saleDate: currentDate,
              storeId: store.id,
            },
          });

          // Restock
          await prisma.restock.create({
            data: {
              productId: createdProduct.id,
              quantity: quantityChange,
              restockDate: currentDate,
              storeId: store.id,
              supplier: `Supplier ${randomInt(0, 5) + 1}`,
            },
          });

          // Return
          await prisma.return.create({
            data: {
              productId: createdProduct.id,
              quantity: randomInt(0, 5) + 1,
              returnDate: currentDate,
              reason: returnReasons[randomInt(0, returnReasons.length - 1)],
              storeId: store.id,
            },
          });

          // Define smooth variation bounds
          const variationFactor = Math.random() * 0.2 + 0.9; // Random factor between 0.9 and 1.1 (10% variation)
          let newPrice = parseFloat((lastPrice * variationFactor).toFixed(2));

          // Clamp the new price to the realistic range
          const minPrice = createdProduct.price / 3; // Minimum price
          const maxPrice = createdProduct.price * 3; // Maximum price
          newPrice = Math.min(Math.max(newPrice, minPrice), maxPrice);

          await prisma.priceChange.create({
            data: {
              productId: createdProduct.id,
              oldPrice: lastPrice,
              newPrice: newPrice,
              changeDate: currentDate,
              reason:
                priceChangeReasons[randomInt(0, priceChangeReasons.length - 1)],
              storeId: store.id,
            },
          });

          lastPrice = newPrice; // Update the last price

          const adjustedQuantity = randomInt(0, 20) - 10; // Random adjustment between -10 and 10

          // Adjustment
          await prisma.adjustment.create({
            data: {
              productId: createdProduct.id,
              quantity:
                adjustedQuantity === 0
                  ? Math.random() < 0.5
                    ? -1
                    : 1
                  : adjustedQuantity, // Avoid 0 quantity
              adjustmentDate: currentDate,
              reason:
                adjustmentReasons[randomInt(0, adjustmentReasons.length - 1)],
              storeId: store.id,
            },
          });

          // Alert
          if (randomInt(0, 20) < 5) {
            await prisma.alert.create({
              data: {
                productId: createdProduct.id,
                storeId: store.id,
                storeChainId: createdChain.id,
                threshold: randomInt(0, 20) + 1,
                isActive: false,
              },
            });
          }
        }
      }
    }
  }

  console.log("Seeding completed!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
