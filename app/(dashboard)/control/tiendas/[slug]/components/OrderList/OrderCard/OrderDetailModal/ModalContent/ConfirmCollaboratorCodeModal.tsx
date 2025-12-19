"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface Collaborator {
  id: number;
  code: string | null;
  firstName: string;
  lastName: string;
}

interface ConfirmCollaboratorCodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableCollaborators: Collaborator[];
  collaboratorName: string;
  onConfirm: (confirmedByCollaboratorId: number) => Promise<void>;
}

export function ConfirmCollaboratorCodeModal({
  open,
  onOpenChange,
  availableCollaborators,
  collaboratorName,
  onConfirm,
}: ConfirmCollaboratorCodeModalProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Normalizar código ingresado
    const normalizedInputCode = code.trim().toLowerCase().replace(/\s+/g, '');

    // Buscar si el código coincide con algún colaborador de la sucursal
    const matchedCollaborator = availableCollaborators.find((c) => {
      if (!c.code) return false;
      const normalizedCollabCode = c.code.trim().toLowerCase().replace(/\s+/g, '');
      return normalizedCollabCode === normalizedInputCode;
    });

    if (!matchedCollaborator) {
      setError("El código ingresado no corresponde a ningún colaborador de la sucursal");
      return;
    }

    setIsLoading(true);
    try {
      await onConfirm(matchedCollaborator.id);
      setCode("");
      onOpenChange(false);
    } catch (error) {
      console.error("Error confirming code:", error);
      setError("Ocurrió un error al confirmar el cambio");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setCode("");
      setError("");
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogDescription className="text-base text-foreground font-medium pt-2">
            Ingresa tu código de colaborador
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Para confirmar la asignación de{" "}
              <span className="font-semibold text-foreground">
                {collaboratorName}
              </span>
              , por favor ingresa tu código de colaborador.
            </p>
            <div className="space-y-2">
              <Label htmlFor="code">Código de colaborador</Label>
              <Input
                id="code"
                type="text"
                placeholder="Ingresa tu código"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setError("");
                }}
                disabled={isLoading}
                className={error ? "border-red-500 focus-visible:ring-red-500" : ""}
                autoComplete="off"
              />
              {error && (
                <p className="text-sm text-red-500 font-medium">{error}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || !code.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Confirmando...
                </>
              ) : (
                "Confirmar"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
