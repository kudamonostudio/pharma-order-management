"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { OrderList } from "../../components/OrderList";
import { OrdersFilters } from "./OrdersFilters";
import { OrderInStore } from "@/shared/types/store";

interface Collaborator {
  id: number;
  code: string | null;
  firstName: string;
  lastName: string;
  image: string | null;
  isActive: boolean;
}

interface LocationOption {
  id: number;
  name: string;
}

interface OrdersPageContentProps {
  orders: OrderInStore[];
  storeSlug: string;
  availableCollaborators: Collaborator[];
  availableLocations: LocationOption[];
  withPrices: boolean;
  isAdminSupremo: boolean;
  canAccessBranchFilter: boolean;
  currentStatus?: string;
  currentCollaboratorId?: string;
  currentLocationId?: string;
}

export function OrdersPageContent({
  orders,
  storeSlug,
  availableCollaborators,
  availableLocations,
  withPrices,
  isAdminSupremo,
  canAccessBranchFilter,
  currentStatus,
  currentCollaboratorId,
  currentLocationId,
}: OrdersPageContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [currentStatuses, setCurrentStatuses] = useState<string[]>(
    currentStatus ? currentStatus.split(",") : ["PENDIENTE"]
  );

  const handleStatusFilterChange = useCallback((newStatuses: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Update status filter with new combined statuses
    if (newStatuses && newStatuses.length > 0) {
      const uniqueStatuses = Array.from(new Set(newStatuses));
      params.set("status", uniqueStatuses.join(","));
      setCurrentStatuses(uniqueStatuses);
    } else {
      params.delete("status");
      setCurrentStatuses(["PENDIENTE"]);
    }

    const query = params.toString();
    const url = query
      ? `/control/tiendas/${storeSlug}/ordenes?${query}`
      : `/control/tiendas/${storeSlug}/ordenes`;

    router.push(url);
  }, [searchParams, storeSlug, router]);

  const handleManualStatusChange = useCallback((newStatuses: string[]) => {
    // When user manually changes filter, reset to only selected statuses
    setCurrentStatuses(newStatuses);
  }, []);

  return (
    <>
      <div className="mb-6">
        <OrdersFilters
          storeSlug={storeSlug}
          availableCollaborators={availableCollaborators}
          availableLocations={availableLocations}
          currentStatus={currentStatuses.join(",")}
          currentCollaboratorId={currentCollaboratorId}
          currentLocationId={currentLocationId}
          canAccessBranchFilter={canAccessBranchFilter}
          onStatusChange={handleManualStatusChange}
        />
      </div>

      <section className="latest-orders">
        {orders?.length ? (
          <OrderList
            orders={orders}
            storeSlug={storeSlug}
            availableCollaborators={availableCollaborators}
            withPrices={withPrices}
            isAdminSupremo={isAdminSupremo}
            onStatusFilterChange={handleStatusFilterChange}
          />
        ) : (
          <p className="italic mx-2">No hay resultados para estos filtros</p>
        )}
      </section>
    </>
  );
}
