import { mockCollaborators } from "@/app/mocks/collaborators";
import { getStoreBySlug } from "@/app/actions/Store";
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

  //TODO: Reemplazar mockCollaborators con datos reales de colaboradores
  const collaborators = mockCollaborators.map((c) => ({
    ...c,
    isActive: true,
  }));

  return (
    <ColaboradoresContent
      store={store}
      collaborators={collaborators}
      locations={locations}
    />
  );
}
