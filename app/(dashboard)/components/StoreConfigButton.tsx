import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Store } from "@prisma/client";
import { StoreConfigModal } from "./StoreConfigModal";

interface StoreConfigButtonProps {
  store: Store;
  className?: string;
  variant?: "secondary" | "default";
}

export function StoreConfigButton({ store, className = "", variant = "secondary" }: StoreConfigButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        className={className}
        onClick={() => setOpen(true)}
      >
        <Settings className="w-4 h-4" />
        Configuración
      </Button>
      <StoreConfigModal open={open} onOpenChange={setOpen} store={store} />
    </>
  );
}
