import { useCallback } from 'react';
import { customAlphabet } from 'nanoid';

const DEFAULT_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export const useGenerateCode = (
  length = 5,
  alphabet: string = DEFAULT_ALPHABET
) => {
  const generator = customAlphabet(alphabet, length);

  const generateCode = useCallback(() => {
    return generator();
  }, [generator]);

  return { generateCode };
};
