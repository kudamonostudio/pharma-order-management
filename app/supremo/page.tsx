import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import TiendasContent from "./Content";
import { UserStoreHydrator } from "@/app/zustand/UserStoreHydrator";


export default async function ProtectedPage() {
  const supabase = await createClient();

  const stores = await prisma.store.findMany({
    where: {
      deletedAt: null,
    },
    include: {
      profile: {
        where: {
          role: "TIENDA_ADMIN",
        },
        select: {
          email: true,
        },
        take: 1,
      },
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

  return (
    <>
      <UserStoreHydrator
        email={profile.email || ""}
        name={`${profile.firstName || ""} ${profile.lastName || ""}`.trim()}
        avatar={profile.imageUrl || undefined}
        role={profile.role}
      />
      <TiendasContent stores={stores} />
    </>
  );
}
