// src/api/proof.ts
import { restFetch } from "@/utils/restClient";
import type { ProofRequestSelectiveInput, ProofRequestResponse } from "@/types/proof";

export const createProofRequestSelective = (
  payload: ProofRequestSelectiveInput
) => {
  return restFetch<ProofRequestResponse>(
    "/verification/createproofRequest",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
};
