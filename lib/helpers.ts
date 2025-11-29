/* eslint-disable @typescript-eslint/no-explicit-any */
import { Decimal } from "@prisma/client/runtime/library";

export const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};


export const serialize = (obj: any): any => {
  return JSON.parse(
    JSON.stringify(obj, (_, value) =>
      value instanceof Decimal ? value.toString() : value
    )
  );
}

// Helper para limpiar strings vacíos
export const toNullable = (value: FormDataEntryValue | null): string | null => {
  const v = value?.toString().trim();
  return v ? v : null;
};

// Helper para convertir a número seguro
export const toNumberOrNull = (value: FormDataEntryValue | null): number | null => {
  const num = Number(value);
  return isNaN(num) ? null : num;
};
