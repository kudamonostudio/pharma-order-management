/* eslint-disable @typescript-eslint/no-explicit-any */
import { Decimal } from "@prisma/client/runtime/library";
import { MESSAGE_LIMITS } from "./constants";

export const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const normalize = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');


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

export const validateMessageContent = (message: string): string => {
  const trimmed = message.trim();

  if (trimmed.length < MESSAGE_LIMITS.MIN_LENGTH) {
    throw new Error("Message cannot be empty");
  }

  if (trimmed.length > MESSAGE_LIMITS.MAX_LENGTH) {
    throw new Error(
      `Message exceeds maximum length of ${MESSAGE_LIMITS.MAX_LENGTH} characters`
    );
  }

  return trimmed;
}
