"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { loginUnique } from "@/lib/auth/login";
import { useUserStore } from "@/app/zustand/userStore";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        const { profile, storeSlug, userProfile } = await loginUnique(
          email,
          password,
        );

        // Guardar datos del usuario en el store
        setUser(userProfile);

        if (profile?.role === "ADMIN_SUPREMO") {
          router.push("/supremo");
        } else if (profile?.role === "TIENDA_ADMIN") {
          router.push(`/control/tiendas/${storeSlug}`);
        } else {
          router.push(`/control/tiendas/${storeSlug}/sucursales`);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Ocurrió un error inesperado.";
        setError(message);
      }
    });
  };

  return (
    <form onSubmit={handleLogin}>
      <div className="flex flex-col gap-6 mb-12">
        <div className="grid gap-2">
          <Label htmlFor="email" className="text-lg font-normal">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-lg! p-6"
          />
        </div>

        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password" className="text-lg font-normal">
              Contraseña
            </Label>
            {/* <Link
                href="/auth/forgot-password"
                className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link> */}
          </div>
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
        disabled={isPending}
      >
        {isPending ? "Iniciando sesión..." : "Iniciar sesión"}
      </Button>
      {/* No es necesario registro al momento */}
      {/*       <div className="mt-4 text-center text-sm">
        ¿No tienes una cuenta?{" "}
        <Link href="/auth/sign-up" className="underline underline-offset-4">
          Regístrate
        </Link>
      </div> */}
    </form>
  );
}
