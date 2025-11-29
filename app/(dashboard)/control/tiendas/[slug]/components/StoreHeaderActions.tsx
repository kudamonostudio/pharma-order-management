"use client";

import { Store } from "@prisma/client";
import { StoreConfigButton } from "@/app/(dashboard)/components/StoreConfigButton";

interface StoreHeaderActionsProps {
  store: Store;
}

export function StoreHeaderActions({ store }: StoreHeaderActionsProps) {
  return (
      <StoreConfigButton store={store} />
  );
}
