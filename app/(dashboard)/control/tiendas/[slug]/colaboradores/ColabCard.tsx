import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, NotepadText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Branch } from "@/shared/types/collaborator";
import { Collaborator } from "@prisma/client";
import Link from "next/link";

interface ColabCardProps extends Collaborator {
  branches: Branch[];
  onEditClick?: () => void;
}

export const ColabCard = ({ onEditClick, ...collaborator }: ColabCardProps) => {
  const isActive = collaborator.isActive ?? true;

  const collaboratorActiveLocations = collaborator.branches.filter(
    (b) => b.isActive
  );
  return (
    <div key={collaborator.id} className="p-4 flex flex-col gap-2">
      <div className="flex justify-end">
        <Badge
          className={cn(
            "gap-1.5 text-xs font-medium px-3 rounded-full",
            isActive
              ? "bg-emerald-600/70 text-white"
              : "bg-gray-100 text-gray-600",
            "hover:bg-opacity-80 backdrop-blur-sm"
          )}
        >
          {isActive && (
            <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-pulse" />
          )}
          {isActive ? "Activo" : "Inactivo"}
        </Badge>
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex gap-3 items-center flex-1">
          <Avatar className="shadow-sm border-2 border-background w-20 h-20 ring-1 ring-border bg-gray-100 mt-2">
            <>
              <AvatarImage
                src={collaborator.image ?? undefined}
                alt="Avatar"
                className="rounded-full object-cover"
              />
              <AvatarFallback />
            </>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">
              {collaborator.firstName} {collaborator.lastName}
            </h3>
            <h4 className="text-sm text-muted-foreground">
              <span className="font-semibold">
                {collaboratorActiveLocations.length > 0
                  ? collaboratorActiveLocations.map((b) => b.name).join(", ")
                  : "Sin sucursal"}
              </span>
            </h4>
            <span className="text-neutral-600 font-medium text-sm leading-5">
              # {collaborator.code}
            </span>
          </div>
        </div>
        <div className="">
          {onEditClick && (
            <Button onClick={onEditClick} className="w-full mt-3">
              <Pencil className="h-4 w-4" />
              Editar
            </Button>
          )}
          <Link
            href={`./ordenes?status=PENDIENTE&collaboratorId=${collaborator.collaboratorId}`}
          >
            <Button className="w-full mt-3">
              <NotepadText className="h-4 w-4" />
              Ver Órdenes
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
