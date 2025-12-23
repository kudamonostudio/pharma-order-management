import { getOrdersByStore } from "@/app/actions/Orders";
import { getStoreBySlug } from "@/app/actions/Store";
import { redirect } from "next/navigation";

export default async function OrdenesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const store = await getStoreBySlug(slug);

  if (!store) {
    redirect("/supremo");
  }
  
  // TODO: TRAER ORDERS DEL ACTION "getOrdersByStore"

  const ordersResponse = await getOrdersByStore(store.id);

  if (!ordersResponse) {
    return;
  }

  const { orders } = ordersResponse;

  return (
    <div className="px-8 py-4 w-full">
      <h1 className="font-bold text-2xl mb-6">Órdenes de {store.name}</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="p-4 border rounded-lg flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{order.id}</h3>
              <p className="text-sm text-muted-foreground">{order.fullname}</p>
            </div>
            <div className="text-right">
                <p className="font-bold">${order.totalAmount}</p>
                <p className="text-sm text-muted-foreground">{order.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
