"use client";

import BranchCard from "@/app/(dashboard)/control/tiendas/[slug]/components/BranchCard";
import { CreateBranchButton } from "./CreateBranchButton";
import { Location, Store } from "@prisma/client";
import { useState } from "react";
import { BranchConfigModal } from "./components/BranchConfigModal";
import { AssignmentWithCollaborator } from "@/shared/types/store";
import { Branch } from "@/shared/types/collaborator";

interface StoreCollaborator {
  assignmentId: number;
  collaboratorId: number;
  firstName: string;
  lastName: string;
  image: string | null;
  isActive: boolean;
  branches: Branch[];
}

interface LocationWithCollaborators extends Location {
  collaboratorAssignments: AssignmentWithCollaborator[];
}

// interface StoreExtended {
//   collaboratorAssignments: AssignmentWithCollaborator[];
// }

interface SucursalesContentProps {
  store: Store;
  branches: LocationWithCollaborators[];
  allCollaborators: StoreCollaborator[];
}

export default function SucursalesContent({
  store,
  branches,
  allCollaborators,
}: SucursalesContentProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] =
    useState<LocationWithCollaborators | null>(null);

  const handleEditClick = (branch: LocationWithCollaborators) => {
    setSelectedBranch(branch);
    setIsEditModalOpen(true);
  };

  // Convertir allCollaborators al formato esperado por el modal (con todos los campos)
  const collaboratorsForModal = allCollaborators.map((c) => ({
    collaboratorId: c.collaboratorId,
    firstName: c.firstName,
    lastName: c.lastName,
    image: c.image,
    branches: c.branches,
    isActive: c.isActive,
  }));

  return (
    <div className="px-8 py-4 w-full">
      <div className="flex flex-col gap-2 items-start mt-4 justify-between sm:flex-row mb-4">
        <h1 className="font-bold text-2xl mb-6">Sucursales de {store.name}</h1>

        <CreateBranchButton />
      </div>
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {branches.length === 0 && (
          <p className="text-base text-muted-foreground italic">
            No hay sucursales creadas aún.
          </p>
        )}
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
        allCollaborators={collaboratorsForModal}
      />
    </div>
  );
}
