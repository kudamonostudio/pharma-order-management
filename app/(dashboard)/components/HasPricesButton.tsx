import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DollarSign } from "lucide-react";
import React from "react";

type HasPricesButtonProps = {
  isActive?: boolean;
  variant?: "small";
};

function HasPricesButton({ isActive, variant }: HasPricesButtonProps) {
  if (variant === "small") {
    return (
      <div className={cn("p-1.5 ", isActive ? "bg-emerald-600/70" : "bg-gray-600/40", "text-gray-600", "rounded-full")}>
        <DollarSign className="w-4 h-4 text-white" />
      </div>
    );
  }

  return (
    <Button
      className={cn(
        "mt-2 w-full",
        isActive ? "bg-emerald-400/55" : "bg-gray-500/40",
        "hover:bg-opacity-80 backdrop-blur-sm"
      )}
      size="sm"
    >
      {isActive && (
        <span className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse" />
      )}
      <DollarSign className="w-4 h-4 mr-2" />
    </Button>
  );
}

export default HasPricesButton;
