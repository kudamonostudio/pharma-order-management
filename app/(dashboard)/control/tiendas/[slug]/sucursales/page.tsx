import { redirect } from "next/navigation";
import SucursalesContent from "./Content";
import { getStoreBySlug } from "@/app/actions/Store";

export default async function SucursalesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);

  if (!store) {
    redirect("/supremo");
  }

  return <SucursalesContent store={store} branches={store.locations} />;
}
