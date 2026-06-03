export type SchemaAttribute = {
    id: number;
    name: string;
    schemaDataType: string;
    displayName: string;
    create_date: string;
    schemaId: number;
};

export type CredentialDefinition = {
    id: number;
    name: string;
    issuerId: string;
    cred_def_id: string;
    unqualified_cred_def_id: string;
    create_date: string;
    schemaId: number;
};

export type Schema = {
    id: number;
    name: string;
    issuerId: string;
    version: string;
    schema_id: string;
    unqualified_schema_id: string;
    create_date: string;
    attributes: SchemaAttribute[];
    credentialDefinitions: CredentialDefinition[];
};

/* ---------- API WRAPPERS ---------- */

export type SchemaListResponse = {
    success: true;
    data: Schema[];
};

export type SchemaPaginatedResponse = {
    success: true;
    data: {
        items: Schema[];
        total: number;
        page: number;
        limit: number;
    };
};
