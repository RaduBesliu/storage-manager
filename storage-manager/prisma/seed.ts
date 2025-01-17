import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Clearing database...");

  // Clear existing data
  await prisma.sale.deleteMany();
  await prisma.restock.deleteMany();
  await prisma.return.deleteMany();
  await prisma.priceChange.deleteMany();
  await prisma.adjustment.deleteMany();

  await prisma.product.deleteMany();
  await prisma.store.deleteMany();
  await prisma.storeChain.deleteMany();
  await prisma.user.deleteMany();

  await prisma.$executeRaw`TRUNCATE TABLE "Sale", "Restock", "Return", "PriceChange", "Adjustment", "Product", "Store", "StoreChain", "User" RESTART IDENTITY CASCADE`;

  console.log("Seeding database...");

  // Create users
  const superAdmin = await prisma.user.create({
    data: {
      name: "Super Admin",
      email: "superadmin@gmail.com",
      password: "superadmin",
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
      password: "storeadmin",
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
      password: "employee",
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
          const daysToAdd = Math.floor(Math.random() * 15) + 5;
          currentDate.setDate(currentDate.getDate() + daysToAdd);

          const quantityChange = Math.floor(Math.random() * 20) + 1;

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
              supplier: `Supplier ${Math.floor(Math.random() * 3) + 1}`,
            },
          });

          // Return
          await prisma.return.create({
            data: {
              productId: createdProduct.id,
              quantity: Math.floor(Math.random() * 3) + 1,
              returnDate: currentDate,
              reason: "Customer return",
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
              reason: "Price adjustment",
              storeId: store.id,
            },
          });

          lastPrice = newPrice; // Update the last price

          const adjustedQuantity = Math.floor(Math.random() * 20) - 10; // Random adjustment between -10 and 10

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
              reason: "Inventory audit",
              storeId: store.id,
            },
          });
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
