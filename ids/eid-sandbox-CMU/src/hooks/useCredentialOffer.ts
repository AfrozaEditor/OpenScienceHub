"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCredentialOffer } from "@/api/offer";
import { CreateOfferPayload } from "@/types/offer";

/* ---------------- CREATE OFFER ---------------- */

export const useCreateOffer = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOfferPayload) =>
      createCredentialOffer(payload),

    onSuccess: () => {
      // optional: invalidate offers / connections / credentials
      qc.invalidateQueries({ queryKey: ["offers"] });
    },
  });
};
