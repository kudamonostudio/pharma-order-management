import { redirect } from "next/navigation";
import { OrderList } from "./components/OrderList";
import { getStoreWithOrders } from "@/app/actions/Store";
import { getCollaboratorsByStore } from "@/app/actions/Collaborators";

export default async function StorePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const response = await getStoreWithOrders(slug);

  // Acciones para las ordenes:
  // getStoreWithOrders() --> entrega la tienda con sus ordenes paginadas opcionalmente
  // getOrdersByStore() --> entrega directamente las ordenes paginadas
  // createOrder --> crea orden
  // updateOrderStatus --> actualiza el estado de la orden
  // getOrderMessages --> entrega los mensajes de la orden
  // createMessage --> crea un mensaje
  // updateOrderMessage --> actualiza un mensaje

  if (!response) {
    redirect("/supremo");
  }

  const { store, ordersPagination } = response;

  // Obtener colaboradores de la tienda
  const collaboratorsData = await getCollaboratorsByStore(store.id);
  const availableCollaborators = collaboratorsData.map((c) => ({
    id: c.collaboratorId,
    firstName: c.firstName,
    lastName: c.lastName,
    image: c.image,
    isActive: c.isActive,
  }));

  //console.log({ store, ordersPagination }); // VER AQUI EL CONTENIDO

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
          <OrderList
            orders={store.orders ?? []}
            storeSlug={slug}
            availableCollaborators={availableCollaborators}
          />
        </section>
      </div>
    </div>
  );
}
