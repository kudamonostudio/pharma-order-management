import { getStoreBySlug } from "@/app/actions/Store";
import { getCollaboratorsByStore } from "@/app/actions/Collaborators";
import { redirect } from "next/navigation";
import ColaboradoresContent from "./Content";
import { prisma } from "@/lib/prisma";

export default async function ColaboradoresPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const store = await getStoreBySlug(slug);

  if (!store) {
    redirect("/supremo");
  }

  // Obtener las sucursales de la tienda
  const locations = await prisma.location.findMany({
    where: {
      storeId: store.id,
      deletedAt: null,
    },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
    },
  });

  // Obtener colaboradores reales de la base de datos
  const collaborators = await getCollaboratorsByStore(store.id);

  return (
    <ColaboradoresContent
      store={store}
      collaborators={collaborators}
      locations={locations}
    />
  );
}
