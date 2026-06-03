"use client";

import {
    useQuery,
    useMutation,
    useQueryClient,
    keepPreviousData,
} from "@tanstack/react-query";
import {
    createSchema,
    getAllSchemas,
    getSchemasPaginated,
    CreateSchemaPayload,
} from "@/api/schema";

/* ---------------- LIST ALL (NO PAGINATION) ---------------- */

export const useAllSchemas = () => {
    return useQuery({
        queryKey: ["schemas", "all"],
        queryFn: getAllSchemas,
    });
};

/* ---------------- LIST PAGINATED ---------------- */

export interface UseSchemasParams {
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
}

export const useSchemas = (params: UseSchemasParams) => {
    const query = new URLSearchParams();

    if (params.search) query.set("search", params.search);
    if (params.status) query.set("status", params.status);
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));

    return useQuery({
        queryKey: ["schemas", params],
        queryFn: () => getSchemasPaginated(query.toString()),
        placeholderData: keepPreviousData,
    });
};

/* ---------------- CREATE ---------------- */

export const useCreateSchema = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateSchemaPayload) =>
            createSchema(payload),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["schemas"] });
        },
    });
};
