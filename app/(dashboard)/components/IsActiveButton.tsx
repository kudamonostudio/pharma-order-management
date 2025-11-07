import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import React from "react";

type IsActiveButtonProps = {
  isActive?: boolean;
  variant?: "small";
};

function IsActiveButton({ isActive, variant }: IsActiveButtonProps) {
  if (variant === "small") {
    return (
      <Badge
        className={cn(
          "mt-2 gap-1.5",
          isActive ? "bg-emerald-600/70" : "bg-gray-500/60",
          "hover:bg-opacity-80 backdrop-blur-sm"
        )}
      >
        {isActive && (
          <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-pulse" />
        )}
        {isActive ? "ONLINE" : "OFFLINE"}
      </Badge>
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
      {isActive ? "ONLINE" : "OFFLINE"}
    </Button>
  );
}

export default IsActiveButton;
