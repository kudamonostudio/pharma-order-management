import IsActiveButton from "@/app/(dashboard)/components/IsActiveButton";
import { Store } from "@prisma/client";
import { LogoPlaceholder } from "../../../../components/LogoPlaceholder";
import { StoreHeaderActions } from "./StoreHeaderActions";
import { getCurrentProfile } from "@/lib/auth/session";
import HasPricesButton from "@/app/(dashboard)/components/HasPricesButton";
import HasShippingButton from "@/app/(dashboard)/components/HasShippingButton";
import HasLocationButton from "@/app/(dashboard)/components/HasLocationButton";
import { LinkToPublicStore } from "./LinkToPublicStore";
import Image from "next/image";

interface StoreHeaderProps {
  store: Store;
}

export async function StoreHeader({ store }: StoreHeaderProps) {
  // Get user profile to check role
  const profile = await getCurrentProfile();

  const isAdminSupremo = profile?.role === "ADMIN_SUPREMO";

  return (
    <div className="flex justify-between py-4 gap-2">
      <div className="flex items-center gap-4">
        {store.logo ? (
          <Image
            src={store.logo}
            alt={store.name}
            className="w-20 h-20 rounded-full object-cover"
            width={80}
            height={80}
          />
        ) : (
          <LogoPlaceholder variant="store" isActive={store.isActive} />
        )}
        <div>
          <div className="flex flex-col lg:flex-row lg:justify-center lg:items-center gap-4">
            <div className="flex gap-2">
              <h1 className="font-bold text-xl lg:text-3xl">{store.name}</h1>
              <LinkToPublicStore store={store.slug} />
            </div>
            {isAdminSupremo && (
              <div className="flex gap-2">
                <IsActiveButton isActive={store.isActive} variant="small" />
                {store.withPrices && (
                  <HasPricesButton isActive={store.isActive} variant="small" />
                )}
                {store.withShipping && (
                  <HasShippingButton isActive={store.isActive} variant="small" />
                )}
                {store.withLocation && (
                  <HasLocationButton isActive={store.isActive} variant="small" />
                )}
              </div>
            )}
          </div>
          <p className="text-muted-foreground mt-4 lg:mt-0">{store.address}</p>
          <p className="text-muted-foreground">{store.phone}</p>
        </div>
      </div>
      {profile?.role !== "SUCURSAL_ADMIN" && <StoreHeaderActions store={store} />}
    </div>
  );
}
