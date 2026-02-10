import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";
import React from "react";

type HasLocationButtonProps = {
  isActive?: boolean;
  variant?: "small";
};

function HasLocationButton({ isActive, variant }: HasLocationButtonProps) {
  if (variant === "small") {
    return (
      <div className={cn("p-1.5 ", isActive ? "bg-emerald-600/70" : "bg-gray-600/40", "text-gray-600", "rounded-full")}>
        <MapPin className="w-4 h-4 text-white" />
      </div>
    );
  }

  return null;
}

export default HasLocationButton;
