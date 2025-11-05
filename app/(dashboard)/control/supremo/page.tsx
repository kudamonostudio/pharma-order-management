import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export default async function ProtectedPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims.sub as string;

  const profile = await prisma.profile.findUnique({
    where: { id: userId },
  });

  if (profile?.role !== "ADMIN_SUPREMO") {
    redirect("/control/tienda");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <h1 className="font-bold text-2xl mb-4">Vista de ADMIN_SUPREMO</h1>
    </div>
  );
}
