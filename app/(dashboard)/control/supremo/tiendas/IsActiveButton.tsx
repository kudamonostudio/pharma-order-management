import { Button } from "@/components/ui/button";
import React from "react";

type IsActiveButtonProps = {
  isActive?: boolean;
};

function IsActiveButton({ isActive }: IsActiveButtonProps) {
  return (
    <Button
      className={`mt-2 w-full ${
        isActive ? "bg-emerald-400/55" : "bg-gray-500/40"
      } hover:bg-opacity-80 backdrop-blur-sm`}
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
