"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function InviteListener({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    const handleInvite = async () => {
      if (!window.location.hash.includes("access_token")) return;

      const hash = new URLSearchParams(
        window.location.hash.replace("#", "")
      );

      const access_token = hash.get("access_token");
      const refresh_token = hash.get("refresh_token");

      if (!access_token || !refresh_token) return;

      const { data, error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });

      if (error) {
        console.error("Invite setSession error:", error);
        return;
      }

      if (data.session?.user?.invited_at) {
        // Limpia el hash por seguridad
        window.history.replaceState({}, "", "/auth/update-password");
        router.replace("/auth/update-password");
      }
    };

    handleInvite();
  }, [router]);

  return <>{children}</>;
}
