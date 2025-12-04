import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import React from "react";

type ProductIsActiveButtonProps = {
  isActive?: boolean;
  variant?: "small";
};

function ProductIsActiveButton({ isActive, variant }: ProductIsActiveButtonProps) {
  if (variant === "small") {
    return (
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
    );
  }

  return null;
}

export default ProductIsActiveButton;
