// src/hooks/useproof.ts
"use client";

import { useMutation } from "@tanstack/react-query";
import { createProofRequestSelective } from "@/api/proof";
import type {
  ProofRequestSelectiveInput,
  ProofRequestResponse,
} from "@/types/proof";

export function useProofRequestSelective() {
  return useMutation<ProofRequestResponse, Error, ProofRequestSelectiveInput>({
    mutationFn: async (input) => {
      return await createProofRequestSelective(input);
    },
  });
}
