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
          <OrderList orders={mockLastOrders} />
        </section>
      </div>
    </div>
  );
}
