import { redirect } from "next/navigation";
import { OrderList } from "./components/OrderList";
import { getStoreBySlug } from "@/app/actions/Store";

export default async function StorePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);

  if (!store) {
    redirect("/supremo");
  }

  const mockLastOrders = [
    {
      id: 1,
      orderCode: "ORD-751",
      date: new Date().toDateString(),
      status: "PENDIENTE",
      branch: {
        id: 1,
        name: "Sucursal Centro",
      },
      profileId: 0,
    },
    {
      id: 2,
      orderCode: "ORD-752",
      date: new Date().toDateString(),
      status: "LISTO_PARA_RETIRO",
      branch: {
        id: 1,
        name: "Sucursal Centro",
      },
      profileId: 1,
    },
    {
      id: 3,
      orderCode: "ORD-753",
      date: new Date().toDateString(),
      status: "ENTREGADA",
      branch: {
        id: 2,
        name: "Sucursal Paso Molino",
      },
      profileId: 2,
    },
    {
      id: 4,
      orderCode: "ORD-722",
      date: new Date().toDateString(),
      status: "CANCELADA",
      branch: {
        id: 2,
        name: "Sucursal Paso Molino",
      },
      profileId: null,
    },
    {
      id: 5,
      orderCode: "ORD-754",
      date: new Date().toDateString(),
      status: "CANCELADA",
      branch: { id: 1, name: "Sucursal Centro" },
      profileId: 4,
    },
    {
      id: 6,
      orderCode: "ORD-755",
      date: new Date().toDateString(),
      status: "EN_PROCESO",
      branch: { id: 3, name: "Sucursal Atlántida" },
      profileId: 3,
    },
  ];

  return (
    <div className="px-8 py-8 w-full max-w-5xl">
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold mb-2">Órdenes pendientes</h3>
            <p className="text-3xl font-bold">12</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold mb-2">Órdenes concretadas este mes</h3>
            <p className="text-3xl font-bold">234</p>
          </div>
        </div>

        <section className="latest-orders">
          <h2 className="text-2xl font-medium mb-4">Últimas órdenes</h2>
          <OrderList orders={mockLastOrders} /> {/* TODO: CARGAR ÓRDENES REALES */}
        </section>
      </div>
    </div>
  );
}
