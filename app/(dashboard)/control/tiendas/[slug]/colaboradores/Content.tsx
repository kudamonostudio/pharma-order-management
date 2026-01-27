"use client";

import { useState } from "react";
import { Store } from "@prisma/client";
import { ColabCard } from "./ColabCard";
import { ColabModal, Collaborator } from "./ColabModal";
import { EmptyState } from "@/components/ui/empty-state";
import { CreateCollaboratorButton } from "./CreateCollaboratorButton";
import { CreateCollaboratorModal } from "./CreateCollaboratorModal";
import { CollaboratorsFilters } from "./CollaboratorsFilters";

interface SimpleLocation {
  id: number;
  name: string;
}

interface ColaboradoresContentProps {
  store: Store;
  collaborators: Collaborator[];
  locations: SimpleLocation[];
  canAccessBranchFilter: boolean;
  currentLocationId?: string;
}

export default function ColaboradoresContent({
  store,
  collaborators,
  locations,
  canAccessBranchFilter,
  currentLocationId,
}: ColaboradoresContentProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCollaborator, setSelectedCollaborator] =
    useState<Collaborator | null>(null);

  const handleEditClick = (collaborator: Collaborator) => {
    setSelectedCollaborator(collaborator);
    setIsEditModalOpen(true);
  };

  return (
    <div className="px-8 py-4 w-full">
      <div className="flex flex-col gap-2 items-start mt-4 justify-between sm:flex-row mb-4">
        <h1 className="font-bold text-2xl mb-6">
          Colaboradores de {store.name}
        </h1>
        <CreateCollaboratorButton />
      </div>

      <CollaboratorsFilters
        storeSlug={store.slug}
        availableLocations={locations}
        currentLocationId={currentLocationId}
        canAccessBranchFilter={canAccessBranchFilter}
      />

      <div className="space-y-4">
        {collaborators.length === 0 && (
          <EmptyState text="No hay colaboradores registrados." />
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {collaborators.map((collab) => (
            <ColabCard 
              key={collab.id} 
              {...collab} 
              onEditClick={() => handleEditClick(collab)}
            />
          ))}
        </div>
      </div>

      <ColabModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        collaborator={selectedCollaborator}
        storeSlug={store.slug}
        storeId={store.id}
        locations={locations}
      />

      <CreateCollaboratorModal
        storeId={store.id}
        storeSlug={store.slug}
        locations={locations}
      />
    </div>
  );
}
