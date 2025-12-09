/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
require('dotenv').config();

const prisma = new PrismaClient();

const createFunctions = async () => {
  // 4) Function: insertar profile automáticamente en cada nuevo usuario
  await prisma.$executeRawUnsafe(`
    create or replace function public.handle_new_user()
    returns trigger as $$
    begin
      insert into public.profiles (id, role, email) values (new.id, 'SUCURSAL_ADMIN', new.email)
      on conflict (id) do nothing;
      return new;
    end;
    $$ language plpgsql security definer;
  `);

  // 5) Trigger: se crea una sola vez si no existe
  await prisma.$executeRawUnsafe(`
    do $$
    begin
      if not exists (
        select 1 from pg_trigger where tgname = 'on_auth_user_created'
      ) then
        create trigger on_auth_user_created
        after insert on auth.users
        for each row execute procedure public.handle_new_user();
      end if;
    end
    $$;
  `);
}

const executeAuthRLS = async () => {
  // 1. Habilitar RLS
  await prisma.$executeRawUnsafe(`
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
  `);

  // 2. Crear política
  await prisma.$executeRawUnsafe(`
    CREATE POLICY "Allow authenticated users to read own profile"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (id = auth.uid());
  `);

  await prisma.$executeRawUnsafe(`
    GRANT SELECT ON public.profiles TO authenticated;
  `);

  await prisma.$executeRawUnsafe(`
    GRANT USAGE ON SCHEMA public TO authenticated;
  `);
}

async function createBucket() {
  const bucketName = process.env.NEXT_PUBLIC_BUCKET_NAME;
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some((b: { name: string }) => b.name === bucketName);

  if (!exists) {
    console.log(`⏳️ Creando bucket '${bucketName}'...`);
    const { error } = await supabase.storage.createBucket(bucketName, {
      public: true,
    });
    if (error) throw error;
  } else {
    console.log(`⛔️ Bucket '${bucketName}' ya existe.`);
  }
}

async function createBucketPolicies() {
  const bucketName = process.env.NEXT_PUBLIC_BUCKET_NAME;
  console.log(`🔐 Creando policies de Storage ${bucketName}...`);

  // SELECT pública
  await prisma.$executeRawUnsafe(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = '${bucketName}.select.public'
      ) THEN
        CREATE POLICY "${bucketName}.select.public"
        ON storage.objects
        FOR SELECT
        USING (bucket_id = '${bucketName}');
      END IF;
    END $$;
  `);

  // INSERT (solo usuarios autenticados)
  await prisma.$executeRawUnsafe(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = '${bucketName}.insert.authenticated'
      ) THEN
        CREATE POLICY "${bucketName}.insert.authenticated"
        ON storage.objects
        FOR INSERT
        TO authenticated
        WITH CHECK (bucket_id = '${bucketName}');
      END IF;
    END $$;
  `);

  // UPDATE (solo autenticados)
  await prisma.$executeRawUnsafe(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = '${bucketName}.update.authenticated'
      ) THEN
        CREATE POLICY "${bucketName}.update.authenticated"
        ON storage.objects
        FOR UPDATE
        TO authenticated
        USING (bucket_id = '${bucketName}')
        WITH CHECK (bucket_id = '${bucketName}');
      END IF;
    END $$;
  `);

  // DELETE (solo autenticados)
  await prisma.$executeRawUnsafe(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = '${bucketName}.delete.authenticated'
      ) THEN
        CREATE POLICY "${bucketName}.delete.authenticated"
        ON storage.objects
        FOR DELETE
        TO authenticated
        USING (bucket_id = '${bucketName}');
      END IF;
    END $$;
  `);
}


async function insertData() {
  // Crea Admin Supremo
  // const admin = await prisma.user.create({
  //   data: {
  //     name: "Admin Supremo",
  //     email: "admin@pharma.com",
  //     password: process.env.ADMIN_PASSWORD,
  //     role: "ADMIN_SUPREMO",
  //   },
  // });

  // Crea Tienda
  const store = await prisma.store.create({
    data: {
      name: "Farmacia Paysandu",
      address: "Av. Principal 123",
      phone: "999-111-222",
      slug: "farmacia-paysandu",
    },
  });

  const store2 = await prisma.store.create({
    data: {
      name: "Farmacia Central",
      address: "Av. Principal 321",
      phone: "999-111-222",
      slug: "farmacia-central",
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

  // Crea Ordenes
  // await prisma.order.create({
  //   data: {
  //     orderCode: "ORD-0001",
  //     date: new Date(),
  //     status: "PENDING",
  //     total: 150.75,
  //     locationId: location.id,
  //   },
  // });

  // await prisma.order.create({
  //   data: {
  //     orderCode: "ORD-0002",
  //     date: new Date(),
  //     status: "PENDING",
  //     total: 300.00,
  //     locationId: location.id,
  //   },
  // });

  // Crear categoría Limpieza
  const otherCategory = await prisma.category.create({
    data: {
      name: 'Otros',
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
        categoryId: otherCategory.id,
        locationId: location.id,
        storeId: store.id,
      },
      {
        name: 'Bicarbonato de Sodio',
        price: 250.75,
        brand: 'Drogueria Paysandu',
        unit: '1 Kg',
        imageUrl: 'https://picsum.photos/seed/bicarbonato/200/200',
        categoryId: otherCategory.id,
        locationId: location.id,
        storeId: store.id,
      },
      {
        name: 'Limpiador Pino Fresh',
        price: 500.00,
        brand: 'Drogueria Paysandu',
        unit: '1 L',
        imageUrl: 'https://picsum.photos/seed/limpiadorpino/200/200',
        categoryId: otherCategory.id,
        locationId: location.id,
        storeId: store.id,
      },
    ],
  });
}



async function main() {
  // Functions and triggers:
  await executeAuthRLS();
  await createFunctions();
  await insertData();
  await createBucket();
  await createBucketPolicies();

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
