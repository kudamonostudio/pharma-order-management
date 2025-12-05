"use client";

import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export async function uploadStoreLogo(storeId: number, file: File) {
  const filePath = `stores/${storeId}/logo/${crypto.randomUUID()}-${file.name}`;

  // Subir archivo
  const { error: uploadError } = await supabase.storage
    .from(process.env.NEXT_PUBLIC_BUCKET_NAME!)
    .upload(filePath, file);

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  // Obtener URL pública
  const { data: urlData } = supabase.storage
    .from(process.env.NEXT_PUBLIC_BUCKET_NAME!)
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}

export async function uploadProductImage(
  storeId: number,
  productId: number,
  file: File
) {
  const filePath = `stores/${storeId}/products/${productId}/${crypto.randomUUID()}-${
    file.name
  }`;

  // Subir archivo
  const { error: uploadError } = await supabase.storage
    .from(process.env.NEXT_PUBLIC_BUCKET_NAME!)
    .upload(filePath, file);

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  // Obtener URL pública
  const { data: urlData } = supabase.storage
    .from(process.env.NEXT_PUBLIC_BUCKET_NAME!)
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}

export async function uploadCollaboratorImage(
  storeId: number,
  collaboratorId: string,
  file: File
) {
  const filePath = `stores/${storeId}/collaborators/${collaboratorId}/${crypto.randomUUID()}-${
    file.name
  }`;

  // Subir archivo
  const { error: uploadError } = await supabase.storage
    .from(process.env.NEXT_PUBLIC_BUCKET_NAME!)
    .upload(filePath, file);

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  // Obtener URL pública
  const { data: urlData } = supabase.storage
    .from(process.env.NEXT_PUBLIC_BUCKET_NAME!)
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}

export async function uploadImage(filePath: string, file: File) {
  // const filePath = `stores/${storeId}/products/${productId}/${crypto.randomUUID()}-${file.name}`;

  // Subir archivo
  const { error: uploadError } = await supabase.storage
    .from(process.env.NEXT_PUBLIC_BUCKET_NAME!)
    .upload(filePath, file);

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  // Obtener URL pública
  const { data: urlData } = supabase.storage
    .from(process.env.NEXT_PUBLIC_BUCKET_NAME!)
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}
