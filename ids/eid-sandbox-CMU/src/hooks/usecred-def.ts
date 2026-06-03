"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  getCredentialDefinitions,
  createCredentialDefinition,
} from "@/api/cred-def";
import {
  CreateCredDefPayload,
  CredDefPaginatedResponse,
} from "@/types/cred-def";
/* ---------------- LIST PAGINATED ---------------- */

export interface UseCredDefParams {
  page?: number;
  limit?: number;
  schemaId?: string;
  search?: string;
  status?: string;
}

export const useCredentialDefinitions = (
  params: UseCredDefParams
) => {
  const query = new URLSearchParams();

  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.schemaId) query.set("schemaId", params.schemaId);
  if (params.search) query.set("search", params.search);
  if (params.status) query.set("status", params.status);


  return useQuery<CredDefPaginatedResponse>({
    queryKey: ["cred-def", params],
    queryFn: () =>
      getCredentialDefinitions(query.toString()),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000, // 1 min cache
  });
};

/* ---------------- CREATE ---------------- */

export const useCreateCredentialDefinition = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCredDefPayload) =>
      createCredentialDefinition(payload),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cred-def"] });
    },
  });
};
