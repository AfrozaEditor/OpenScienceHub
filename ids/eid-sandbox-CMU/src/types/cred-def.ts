
export type CredentialSchemaRef = {
    id: number;
    name: string;
    issuerId: string;
    version: string;
    schema_id: string;
    unqualified_schema_id: string;
    create_date: string;
};

export type CredentialDefinition = {
    id: number;
    name: string;
    issuerId: string;
    cred_def_id: string;
    unqualified_cred_def_id: string;
    create_date: string;
    schemaId: number;
    schema: CredentialSchemaRef;
    status: "ACTIVE" | "DRAFT" | "REVOKED" | string;
};

/* ---------- LIST RESPONSE ---------- */

export type CredDefPaginatedResponse = {
    success: true;
    data: {
        items: CredentialDefinition[];
        total: number;
        page: number;
        limit: number;
    };
};

/* ---------- CREATE PAYLOAD ---------- */

export type CreateCredDefPayload = {
    schemaId: string;
    tag: string;
    supportRevocation: boolean;
};
