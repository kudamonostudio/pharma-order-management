import { createClient } from "@/lib/supabase/client";

/**
 * Login de usuario con validación de rol ADMIN_SUPREMO
 */
export async function loginAsAdminSupremo(email: string, password: string) {
  const supabase = createClient();

  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({ email, password });

  if (authError) throw new Error(authError.message);

  const user = authData.user;
  if (!user) throw new Error("No se encontró el usuario.");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.log({ profileError })
    throw new Error(profileError.message);

  }
  if (profile?.role !== "ADMIN_SUPREMO") {
    await supabase.auth.signOut();
    throw new Error("No tienes permisos para acceder.");
  }

  return user;
}

/**
 * Login de usuario con validación de rol COLABORADOR y ADMIN_TIENDA
 */
export async function loginAsCollaborator(email: string, password: string, storeId: number) {
  const supabase = createClient();

  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({ email, password });

  if (authError) throw new Error(authError.message);

  const user = authData.user;
  if (!user) throw new Error("No se encontró el usuario.");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, storeId")
    .eq("id", user.id)
    .single();

  console.log({ profile });

  if (profileError) {
    console.log({ profileError })
    throw new Error(profileError.message);

  }
  if (profile.role !== "ADMIN_SUPREMO" && profile.storeId !== storeId) {
    await supabase.auth.signOut();
    throw new Error("No tienes permisos para acceder a esta cuenta.");
  }

  return user;
}