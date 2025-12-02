import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { cache } from "react";

export const getCurrentProfile = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims.sub as string;

  if (!userId) return null;

  const profile = await prisma.profile.findUnique({
    where: { id: userId },
  });

  return profile;
});
