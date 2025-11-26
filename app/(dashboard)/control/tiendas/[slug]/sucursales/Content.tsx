"use client";

import BranchCard from "@/app/(dashboard)/control/tiendas/[slug]/components/BranchCard";
import { CreateBranchButton } from "./CreateBranchButton";
import { Location, Store } from "@prisma/client";
import { useState } from "react";
import { BranchConfigModal } from "./components/BranchConfigModal";

interface SucursalesContentProps {
  store: Store;
  branches: Location[];
}

export default function SucursalesContent({
  store,
  branches,
}: SucursalesContentProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Location | null>(null);

  const handleEditClick = (branch: Location) => {
    setSelectedBranch(branch);
    setIsEditModalOpen(true);
  };

  return (
    <div className="px-8 py-4 w-full">
      <div className="flex flex-col gap-2 items-start mt-4 justify-between sm:flex-row mb-4">
        <h1 className="font-bold text-2xl mb-6">Sucursales de {store.name}</h1>

        <CreateBranchButton />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {branches.map((branch) => (
          <BranchCard
            branch={branch}
            key={branch.id}
            store={store}
            onEdit={handleEditClick}
          />
        ))}
      </div>

      <BranchConfigModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        branch={selectedBranch}
        storeSlug={store.slug}
      />
    </div>
  );
}
