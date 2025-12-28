import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export default async function ControlPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/");
  }

  const userId = data.claims.sub as string;

  const profile = await prisma.profile.findUnique({
    where: { id: userId },
  });

  if(!profile) {
    redirect("/auth/login");
  }

  if(profile.role === Role.ADMIN_SUPREMO) {
    redirect("/supremo");
  }

  if(!profile.storeId) {
    redirect("/");
  }

  const store = await prisma.store.findUnique({
    where: {
      id: profile.storeId,
    }
  });

  const storeSlug = store?.slug ?? '';

  switch (profile.role) {
    case Role.TIENDA_ADMIN:
      redirect(`/control/tiendas/${storeSlug}`);

    case Role.SUCURSAL_ADMIN:
      redirect(`/control/tiendas/${storeSlug}/sucursales`);

    default:
      redirect("/");
  }
}
