"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PrimaryButtonProps } from "@/shared/types/ui";
import { useProductStore } from "@/app/zustand/productStore";

export function CreateProductButton({
  className,
  variant = "default",
  size = "default",
  children,
}: PrimaryButtonProps) {
  const openCreateProductModal = useProductStore(
    (state) => state.openCreateProductModal
  );

  return (
    <Button
      onClick={openCreateProductModal}
      className={className}
      variant={variant}
      size={size}
    >
      {children || (
        <>
          <Plus className="w-4 h-4 mr-2" />
          Crear nuevo producto
        </>
      )}
    </Button>
  );
}
