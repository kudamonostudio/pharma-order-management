import { redirect } from "next/navigation";

export default async function OrdenesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/stores/${slug}`, { cache: 'no-store' });

  if (!res.ok) {
    redirect("/control/supremo/tiendas");
  }

  const store = await res.json();

  // TODO: Reemplazar con datos reales de órdenes
  const mockOrders = [
    { id: "ORD-001", customer: "Cliente A", total: 150.00, status: "Pendiente" },
    { id: "ORD-002", customer: "Cliente B", total: 85.50, status: "Completada" },
    { id: "ORD-003", customer: "Cliente C", total: 200.00, status: "En proceso" },
  ];

  return (
    <div className="px-8 py-4 w-full">
      <h1 className="font-bold text-2xl mb-6">Órdenes de {store.name}</h1>
      <div className="space-y-4">
        {mockOrders.map((order) => (
          <div key={order.id} className="p-4 border rounded-lg flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{order.id}</h3>
              <p className="text-sm text-muted-foreground">{order.customer}</p>
            </div>
            <div className="text-right">
                <p className="font-bold">${order.total}</p>
                <p className="text-sm text-muted-foreground">{order.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
