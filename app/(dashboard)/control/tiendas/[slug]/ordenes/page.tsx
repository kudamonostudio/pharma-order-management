import { getStoreBySlug } from "@/app/(dashboard)/utils/mockData";
import { redirect } from "next/navigation";
import { OrderList } from "../components/OrderList";

export default async function OrdenesPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const store = getStoreBySlug(slug);

  if (!store) {
    redirect("/control/supremo/tiendas");
  }

  const mockOrders = [
    { id: 1, code: "ORD-001", date: "2025-11-06", status: "PENDIENTE" as const, total: 150.00 },
    { id: 2, code: "ORD-002", date: "2025-11-06", status: "EN_PROCESO" as const, total: 200.00 },
    { id: 3, code: "ORD-003", date: "2025-11-06", status: "LISTO_PARA_RETIRO" as const, total: 180.00 },
    { id: 4, code: "ORD-004", date: "2025-11-06", status: "ENTREGADA" as const, total: 250.50 },
    { id: 5, code: "ORD-005", date: "2025-11-05", status: "CANCELADA" as const, total: 75.00 },
  ];

  return (
    <div className="px-8 py-4 w-full">
      <h1 className="font-bold text-2xl mb-6">Órdenes de {store.name}</h1>
      <OrderList orders={mockOrders} />
    </div>
  );
}
