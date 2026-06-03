import { restFetch } from "@/utils/restClient";
import {
  CredDefPaginatedResponse,
  CreateCredDefPayload,
  CredentialDefinition,
} from "@/types/cred-def";

/* ---------------- LIST (PAGINATED) ---------------- */

export const getCredentialDefinitions = (query: string) =>
  restFetch<CredDefPaginatedResponse>(`/issuance/credential-definitions?${query}`);

/* ---------------- CREATE ---------------- */

export const createCredentialDefinition = (
  payload: CreateCredDefPayload
) =>
  restFetch<{ success: true; data: CredentialDefinition }>(
    "/issuance/credential-definitions",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
