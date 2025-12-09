import { LogoPlaceholder } from "@/app/(dashboard)/components/LogoPlaceholder";
import { ShowAvatars } from "@/components/show-avatars";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AssignmentWithCollaborator } from "@/shared/types/store";
import { Store, Location } from "@prisma/client";
import { ArrowRight, Settings } from "lucide-react";
import Link from "next/link";

// interface Collaborator {
//   id: string;
//   name: string | null;
//   imageUrl: string | null;
//   isActive?: boolean;
// }

interface LocationWithCollaborators extends Location {
  collaboratorAssignments: AssignmentWithCollaborator[];
}

interface BranchCardProps {
  branch: LocationWithCollaborators;
  store: Store;
  onEdit?: (branch: LocationWithCollaborators) => void;
}

function index({ branch, store, onEdit }: BranchCardProps) {
  // Filtrar solo colaboradores activos para mostrar en la card
  // const activeProfiles = branch.profiles.filter((p) => p.isActive !== false); TEMPORAL
  const activeProfiles = branch.collaboratorAssignments.filter((p) => p.isActive !== false);
  return (
    <Card
      key={branch.id}
      className="border border-neutral-200 shadow-none rounded-sm p-2 flex flex-row justify-between"
    >
      <div className="flex flex-row gap-4">
        {store.logo ? (
          <img
            src={store.logo}
            alt={store.name}
            className="w-20 h-20 rounded-full object-cover m-auto"
          />
        ) : (
          <LogoPlaceholder
            variant="store"
            isActive={store.isActive}
            className="m-auto"
          />
        )}
        <div className="flex flex-col justify-center">
          <h1 className="font-bold text-xl">Sucursal {branch.name}</h1>
          <p className="text-base text-muted-foreground">{branch.address}</p>
          <p className="text-base text-muted-foreground font-semibold">
            {branch.phone}
          </p>
        </div>
      </div>
      <ShowAvatars
        items={activeProfiles.map((p) => ({
        // items={branch.collaboratorAssignments.map((p: AssignmentWithCollaborator) => ({ // MIO
          id: p.id,
          name: `${p.collaborator.firstName} ${p.collaborator.lastName}`,
          imageUrl: p.collaborator.image ?? "",
        }))}
        className="m-auto"
      />
      <div className=" space-y-2 p-2 gap-2">
        <Button
          variant="secondary"
          className="flex items-center justify-center gap-2 rounded-xl mb-3"
          onClick={() => onEdit?.(branch)}
        >
          Configuración
          <Settings className="w-4 h-4" />
        </Button>

        <Link
          href={`/control/tiendas/${store.slug}/sucursales/${branch.id}`}
          className="w-full"
        >
          <Button className="w-full flex items-center justify-center rounded-xl">
            Ir a la sucursal
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}

export default index;
