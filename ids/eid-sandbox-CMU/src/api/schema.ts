import { restFetch } from "@/utils/restClient";
import {
    SchemaListResponse,
    SchemaPaginatedResponse,
    Schema,
} from "@/types/schema";

/* ---------- CREATE ---------- */

export type CreateSchemaPayload = {
    name: string;
    version: string;
    issuerId: string;
    orgId: string;
    attributes: {
        attributeName: string;
        schemaDataType: string;
        displayName: string;
    }[];
};

export const createSchema = (payload: CreateSchemaPayload) =>
    restFetch<{ success: true; data: Schema }>("/issuance/schemas", {
        method: "POST",
        body: JSON.stringify(payload),
    });

/* ---------- LIST ALL (NON PAGINATED) ---------- */

export const getAllSchemas = () =>
    restFetch<SchemaListResponse>("/issuance/listSchemas");

/* ---------- LIST PAGINATED ---------- */

export const getSchemasPaginated = (query: string) =>
    restFetch<SchemaPaginatedResponse>(`/issuance/schemas?${query}`);
