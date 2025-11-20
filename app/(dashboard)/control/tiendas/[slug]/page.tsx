// import { getStoreBySlug } from "@/app/(dashboard)/utils/mockData";
import { redirect } from "next/navigation";
import { OrderList } from "./components/OrderList";
import IsActiveButton from "@/app/(dashboard)/components/IsActiveButton";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { getStoreBySlug } from "@/app/actions/Store";
import { createLocation, deleteLocation, updateLocation } from "@/app/actions/Store/Locations";

export default async function StorePage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const store = await getStoreBySlug(slug);

  if (!store) {
    redirect("/supremo");
  }

  // Get user profile to check role
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims.sub as string;

  const profile = await prisma.profile.findUnique({
    where: { id: userId },
  });

  const isAdminSupremo = profile?.role === "ADMIN_SUPREMO";

  const mockLastOrders = [
    {
      id: 1,
      code: "ORD-001",
      date: "2025-11-06",
      status: "PENDIENTE" as const,
      total: 150.0,
    },
    {
      id: 2,
      code: "ORD-002",
      date: "2025-11-06",
      status: "LISTO_PARA_RETIRO" as const,
      total: 180.0,
    },
    {
      id: 3,
      code: "ORD-003",
      date: "2025-11-06",
      status: "ENTREGADA" as const,
      total: 250.5,
    },
    {
      id: 4,
      code: "ORD-004",
      date: "2025-11-05",
      status: "CANCELADA" as const,
      total: 75.0,
    },
    {
      id: 5,
      code: "ORD-005",
      date: "2025-11-05",
      status: "EN_PROCESO" as const,
      total: 75.0,
    },
  ];

  return (
    <div className="px-8 py-8 w-full max-w-5xl">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4 py-4">
          <img
            src={store.logo}
            alt={store.name}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <div className="flex justify-center items-center gap-4">
              <h1 className="font-bold text-3xl">{store.name}</h1>
              {isAdminSupremo && (
                <IsActiveButton isActive={store.isActive} variant="small" />
              )}
            </div>
            <p className="text-muted-foreground">{store.address}</p>
            <p className="text-muted-foreground">{store.phone}</p>
          </div>
        </div>

{/* CRUD Sucursales */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-3">Sucursales</h2>

          {/* FORM Crear sucursal */}
          <form action={createLocation} className="flex gap-4 mb-6">
            <input type="hidden" name="storeId" value={store.id} />
            <input type="hidden" name="slug" value={store.slug} />

            <input
              type="text"
              name="name"
              placeholder="Nombre de sucursal"
              className="border px-3 py-2 rounded"
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Dirección"
              className="border px-3 py-2 rounded"
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Teléfono"
              className="border px-3 py-2 rounded"
            />

            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
              Crear
            </button>
          </form>

          {/* Lista de sucursales con Edit + Delete inline forms */}
          <div className="space-y-3">
            {store.locations.map((loc) => (
              <div key={loc.id} className="flex flex-col md:flex-row justify-between border p-4 rounded gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold">{loc.name}</h3>
                  <p className="text-muted-foreground">{loc.address}</p>
                  <p className="text-muted-foreground">{loc.phone}</p>
                </div>

                <div className="flex items-start gap-4">
                  {/* Edit inline: usa updateLocation */}
                  <form action={updateLocation} className="flex gap-2 items-center">
                    <input type="hidden" name="id" value={loc.id} />
                    <input type="hidden" name="slug" value={store.slug} />

                    <input
                      name="name"
                      defaultValue={loc.name}
                      className="border px-2 py-1 rounded"
                      required
                    />
                    <input
                      name="address"
                      defaultValue={loc.address}
                      className="border px-2 py-1 rounded"
                      required
                    />
                    <input
                      name="phone"
                      defaultValue={loc.phone ?? ""}
                      className="border px-2 py-1 rounded"
                    />
                    <button type="submit" className="px-3 py-1 bg-green-600 text-white rounded">
                      Actualizar
                    </button>
                  </form>

                  {/* Delete: usa deleteLocation */}
                  <form action={deleteLocation}>
                    <input type="hidden" name="id" value={loc.id} />
                    <input type="hidden" name="slug" value={store.slug} />
                    <button className="text-red-600 hover:underline">Eliminar</button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold mb-2">Órdenes pendientes</h3>
            <p className="text-3xl font-bold">12</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold mb-2">Órdenes concretadas</h3>
            <p className="text-3xl font-bold">234</p>
          </div>
        </div>

        <section className="latest-orders">
          <h2 className="text-2xl font-medium mb-4">Últimas órdenes</h2>
          <OrderList orders={mockLastOrders} />
        </section>
      </div>
    </div>
  );
}
