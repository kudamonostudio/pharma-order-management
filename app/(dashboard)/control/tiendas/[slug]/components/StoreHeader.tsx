import IsActiveButton from "@/app/(dashboard)/components/IsActiveButton";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { Store } from "@prisma/client";
import { LogoPlaceholder } from "../../../../components/LogoPlaceholder";

interface StoreHeaderProps {
  store: Store;
}

export async function StoreHeader({ store }: StoreHeaderProps) {
  // Get user profile to check role
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims.sub as string;

  const profile = await prisma.profile.findUnique({
    where: { id: userId },
  });

  const isAdminSupremo = profile?.role === "ADMIN_SUPREMO";

  return (
    <div className="flex items-center gap-4 py-4">
      {store.logo ? (
        <img
          src={store.logo}
          alt={store.name}
          className="w-20 h-20 rounded-full object-cover"
        />
      ) : (
        <LogoPlaceholder variant="store" isActive={store.isActive} />
      )}
      <div>
        <div className="flex justify-center items-center gap-4">
          <h1 className="font-bold text-3xl">{store.name}</h1>
          {isAdminSupremo && (
            <IsActiveButton isActive={store.isActive} variant="small" />
          )}
        </div>
        <p className="text-muted-foreground">{store.address}</p>
        <p className="text-muted-foreground">{store.phone}</p>
      </div>
    </div>
  );
}
