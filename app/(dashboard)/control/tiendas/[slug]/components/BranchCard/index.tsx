import { LogoPlaceholder } from "@/app/(dashboard)/components/LogoPlaceholder";
import { ShowAvatars } from "@/components/show-avatars";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Store, Location } from "@prisma/client";
import { ArrowRight, Settings } from "lucide-react";
import Link from "next/link";

interface BranchCardProps {
  branch: Location;
  store: Store;
  onEdit?: (branch: Location) => void;
}

const mockCollaborators = [
  {
    id: 1,
    imageUrl:
      "https://images.pexels.com/photos/5025492/pexels-photo-5025492.jpeg",
  },
  {
    id: 2,
    imageUrl:
      "https://images.pexels.com/photos/6170091/pexels-photo-6170091.jpeg",
  },
  {
    id: 3,
    imageUrl:
      "https://images.pexels.com/photos/4484072/pexels-photo-4484072.jpeg",
  },
  {
    id: 4,
    imageUrl:
      "https://images.pexels.com/photos/4484071/pexels-photo-4484071.jpeg",
  },
];

function index({ branch, store, onEdit }: BranchCardProps) {
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
          <LogoPlaceholder variant="store" isActive={store.isActive} className="m-auto"/>
        )}
        <div className="flex flex-col justify-center">
          <h1 className="font-bold text-xl">{branch.name}</h1>
          <p className="text-base text-muted-foreground">{branch.address}</p>
          <p className="text-base text-muted-foreground font-semibold">
            {branch.phone}
          </p>
        </div>
      </div>
      <ShowAvatars items={mockCollaborators} className="m-auto" />
      <div className=" space-y-2 p-2 gap-2">
        <Button
          variant="secondary"
          className="flex items-center justify-center gap-2 rounded-xl mb-3"
          onClick={() => onEdit?.(branch)}
        >
          Configuración
          <Settings className="w-4 h-4" />
        </Button>

        <Link href={`/control/tiendas/${store.slug}/sucursales/${branch.id}`} className="w-full">
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
