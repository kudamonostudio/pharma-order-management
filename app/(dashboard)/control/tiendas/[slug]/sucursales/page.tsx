import { redirect } from "next/navigation";
import SucursalesContent from "./Content";
import { getStoreBySlug } from "@/app/actions/Store";
import { getCollaboratorsByStore } from "@/app/actions/Collaborators";
import { getCurrentProfile } from "@/lib/auth/session";

export default async function SucursalesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const currentProfile = await getCurrentProfile();
  if (currentProfile?.role === "SUCURSAL_ADMIN") {
    redirect(`/control/tiendas/${slug}/ordenes`);
  }

  const store = await getStoreBySlug(slug);

  if (!store) {
    redirect("/supremo");
  }

  const allCollaborators = await getCollaboratorsByStore(store.id);

  return (
    <SucursalesContent
      store={store}
      branches={store.locations}
      allCollaborators={allCollaborators}
    />
  );
}
