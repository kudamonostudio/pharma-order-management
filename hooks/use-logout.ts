"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/app/zustand/userStore";

export function useLogout() {
  const router = useRouter();
  const clearUser = useUserStore((state) => state.clearUser);

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    clearUser();
    router.push("/");
  };

  return { logout };
}
