"use client";

import { Button } from "@/components/ui/button";
import { useStoresStore } from "@/app/zustand/storesStore";
import { Plus } from "lucide-react";

interface CreateBranchButtonProps {
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  children?: React.ReactNode;
}

export function CreateBranchButton({
  className,
  variant = "default",
  size = "default",
  children,
}: CreateBranchButtonProps) {
  const openCreateBranchModal = useStoresStore(
    (state) => state.openCreateBranchModal
  );

  return (
    <Button
      onClick={openCreateBranchModal}
      className={className}
      variant={variant}
      size={size}
    >
      {children || (
        <>
          <Plus className="w-4 h-4 mr-2" />
          Crear nueva sucursal
        </>
      )}
    </Button>
  );
}
