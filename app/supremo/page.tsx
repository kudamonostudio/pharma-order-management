import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import TiendasContent from "../(dashboard)/control/supremo/tiendas/Content";


export default async function ProtectedPage() {
  const supabase = await createClient();

  const stores = await prisma.store.findMany({
    where: {
      deletedAt: null,
    },
    omit: {
      deletedAt: true,
    },
  });

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/login");
  }

  const userId = data.claims.sub as string;

  const profile = await prisma.profile.findUnique({
    where: { id: userId },
  });

  if (profile?.role !== "ADMIN_SUPREMO") {
    redirect("/protected"); // TODO a /control/slug
  }

  return <TiendasContent stores={stores} />;
}
