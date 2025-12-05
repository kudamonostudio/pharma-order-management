import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

interface collaborator {
  id: number;
  imageUrl: string;
  name: string;
  isActive?: boolean;
  branch: {
    id: number;
    name: string;
  };
  onEditClick?: () => void;
}

export const ColabCard = ({ onEditClick, ...collaborator }: collaborator) => {
  const isActive = collaborator.isActive ?? true;

  return (
    <div
      key={collaborator.id}
      className="p-4 flex flex-col relative gap-6"
    >
      <div className="absolute top-2 right-2">
        <Badge
          className={cn(
            "gap-1.5 text-xs font-medium px-3 rounded-full",
            isActive ? "bg-emerald-600/70 text-white" : "bg-gray-100 text-gray-600",
            "hover:bg-opacity-80 backdrop-blur-sm"
          )}
        >
          {isActive && (
            <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-pulse" />
          )}
          {isActive ? "Activo" : "Inactivo"}
        </Badge>
      </div>
      <div className="flex gap-3 items-center flex-1">
        <Avatar className="shadow-sm border-2 border-background w-20 h-20 ring-1 ring-border bg-gray-100 mt-2">
          <>
            <AvatarImage
              src={collaborator.imageUrl}
              alt="Avatar"
              className="rounded-full object-cover"
            />
            <AvatarFallback />
          </>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{collaborator.name}</h3>
          <h4 className="text-sm text-muted-foreground">{collaborator.branch.name}</h4>
        </div>
      </div>
      {onEditClick && (
        <Button
          onClick={onEditClick}
          className="w-full mt-3"
        >
          <Pencil className="h-4 w-4" />
          Editar
        </Button>
      )}
    </div>
  );
};
