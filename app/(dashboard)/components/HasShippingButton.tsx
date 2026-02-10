import { cn } from "@/lib/utils";
import { Truck } from "lucide-react";
import React from "react";

type HasShippingButtonProps = {
  isActive?: boolean;
  variant?: "small";
};

function HasShippingButton({ isActive, variant }: HasShippingButtonProps) {
  if (variant === "small") {
    return (
      <div className={cn("p-1.5 ", isActive ? "bg-emerald-600/70" : "bg-gray-600/40", "text-gray-600", "rounded-full")}>
        <Truck className="w-4 h-4 text-white" />
      </div>
    );
  }

  return null;
}

export default HasShippingButton;
