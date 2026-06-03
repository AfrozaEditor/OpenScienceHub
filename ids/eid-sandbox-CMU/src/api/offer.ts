import { restFetch } from "@/utils/restClient";
import {
  CreateOfferPayload,
  OfferResponse,
} from "@/types/offer";

/* ---------------- CREATE OFFER ---------------- */

export const createCredentialOffer = (
  payload: CreateOfferPayload
) =>
  restFetch<OfferResponse>(
    "/issuance/offer",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
