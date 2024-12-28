import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Clearing database...");

  // Clear existing data
  await prisma.product.deleteMany();
  await prisma.store.deleteMany();
  await prisma.storeChain.deleteMany();
  await prisma.user.deleteMany();

  console.log("Seeding database...");

  // Create users
  const superAdmin = await prisma.user.create({
    data: {
      name: "Super Admin",
      email: "superadmin@gmail.com",
      password: "superadmin",
      role: "SUPER_ADMIN",
    },
  });

  const storeAdmin = await prisma.user.create({
    data: {
      name: "Store Admin",
      email: "storeadmin@gmail.com",
      password: "storeadmin",
      role: "STORE_ADMIN",
    },
  });

  const employee = await prisma.user.create({
    data: {
      name: "Employee",
      email: "employee@gmail.com",
      password: "employee",
      role: "STORE_EMPLOYEE",
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
        await prisma.product.create({
          data: {
            ...product,
            storeId: store.id,
          },
        });
      }
    }
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
