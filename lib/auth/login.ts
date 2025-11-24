import { createClient } from "@/lib/supabase/client";

/**
 * Login de usuario para todos los roles
 */
export async function loginUnique(email: string, password: string) {
  const supabase = createClient();

  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({ email, password });

  if (authError) throw new Error(authError.message);

  const user = authData.user;
  if (!user) throw new Error("No se encontró el usuario.");

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select("role, storeId")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.log({ profileError })
    throw new Error(profileError.message);
  }

    let storeSlug: string | null = null;

  if (profile.storeId) {
    const { data: store, error: storeError } = await supabase
      .from("stores")
      .select("slug")
      .eq("id", profile.storeId)
      .single();

    if (storeError) throw new Error(storeError.message);

    storeSlug = store?.slug ?? null;
  }

  return { user, profile, storeSlug };
}
