/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();



async function main() {
  // Crea Admin Supremo
  const admin = await prisma.user.create({
    data: {
      name: "Admin Supremo",
      email: "admin@pharma.com",
      password: process.env.ADMIN_PASSWORD,
      role: "ADMIN_SUPREMO",
    },
  });

  // Crea Tienda
  const store = await prisma.store.create({
    data: {
      name: "Farmacia Central",
      address: "Av. Principal 123",
      phone: "999-111-222",
    },
  });

  // Crea un Admin de la Tienda
  const storeAdmin = await prisma.user.create({
    data: {
      name: "Tienda Admin",
      email: "store.admin@pharma.com",
      password: process.env.ADMIN_PASSWORD,
      role: "TIENDA_ADMIN",
      storeId: store.id,
    },
  });

  // Crea Sucursal (Location)
  const location = await prisma.location.create({
    data: {
      name: "Sucursal Centro",
      address: "Calle Secundaria 456",
      phone: "999-333-444",
      storeId: store.id,
    },
  });

  // Crea Colaborador
  const collaborator = await prisma.user.create({
    data: {
      name: "Colaborador 1",
      email: "colaborador@pharma.com",
      password: process.env.ADMIN_PASSWORD,
      role: "COLABORADOR",
      storeId: store.id,
      locationId: location.id,
    },
  });

  // Crea Ordenes
  await prisma.order.create({
    data: {
      orderCode: "ORD-0001",
      date: new Date(),
      status: "PENDING",
      total: 150.75,
      locationId: location.id,
      userId: collaborator.id,
    },
  });

  await prisma.order.create({
    data: {
      orderCode: "ORD-0002",
      date: new Date(),
      status: "PENDING",
      total: 300.00,
      locationId: location.id,
      userId: collaborator.id,
    },
  });

  // Crear categoría Limpieza
  const limpieza = await prisma.category.create({
    data: {
      name: 'Limpieza',
    },
  });

  // Insertar productos
  await prisma.product.createMany({
    data: [
      {
        name: 'Limpiador Lavanda Fresh',
        price: 150.75,
        brand: 'Drogueria Paysandu',
        unit: '5 L',
        imageUrl: 'https://picsum.photos/seed/limpiadorlavanda/200/200',
        categoryId: limpieza.id,
      },
      {
        name: 'Bicarbonato de Sodio',
        price: 250.75,
        brand: 'Drogueria Paysandu',
        unit: '1 Kg',
        imageUrl: 'https://picsum.photos/seed/bicarbonato/200/200',
        categoryId: limpieza.id,
      },
      {
        name: 'Limpiador Pino Fresh',
        price: 500.00,
        brand: 'Drogueria Paysandu',
        unit: '1 L',
        imageUrl: 'https://picsum.photos/seed/limpiadorpino/200/200',
        categoryId: limpieza.id,
      },
    ],
  });

  console.log("✅ Seed completado con éxito")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
