"use client";

import type React from "react";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function UpdatePasswordForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      router.push("/control");
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "Ocurrió un error inesperado.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpdatePassword}>
      <div className="flex flex-col gap-6 mb-12">
        <div className="grid gap-2">
          <Label htmlFor="password" className="text-lg font-normal">
            Nueva contraseña
          </Label>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-lg! p-6"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
      <Button
        type="submit"
        className="w-full rounded-full p-8 text-xl font-normal"
        disabled={isLoading}
      >
        {isLoading ? "Guardando..." : "Guardar contraseña"}
      </Button>
    </form>
  );
}
