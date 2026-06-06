export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type ApiErrorPayload = {
  detail?: string;
  code?: string;
  errors?: Record<string, string[]>;
  [key: string]: unknown;
};

export type UserRole = {
  id?: string;
  role?: string;
  role_code?: string;
  role_label?: string;
  code?: string;
  label?: string;
  scope_type?: string;
  scope_id?: string;
};

export type UserCapabilities = {
  roles?: string[];
  portals?: string[];
  default_portal?: "admin" | "validation" | "deposant" | string;
  is_platform_admin?: boolean;
  is_institution_admin?: boolean;
  institution_scope_ids?: string[];
  department_scope_ids?: string[];
  work_scope_ids?: string[];
  can_archive?: boolean;
  can_decide?: boolean;
  can_validate?: boolean;
};

export type CurrentUser = {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  status?: string;
  institution?: string | null;
  academic_identifier?: string;
  orcid?: string;
  preferred_language?: string;
  is_staff?: boolean;
  is_superuser?: boolean;
  roles?: UserRole[];
  capabilities?: UserCapabilities;
  created_at?: string;
};

export type AuthTokens = {
  access: string;
  refresh: string;
};

export type Institution = {
  id: string;
  name: string;
  short_name?: string;
  type?: string;
  country?: string;
  city?: string;
  official_email?: string;
  website_url?: string;
  logo_url?: string;
  status?: string;
};

export type Faculty = {
  id: string;
  institution: string;
  name: string;
  code?: string;
  status?: string;
};

export type Department = {
  id: string;
  faculty: string;
  name: string;
  code?: string;
  status?: string;
};

export type Work = {
  id: string;
  reference_code: string | null;
  type: string;
  title: string;
  abstract_text?: string;
  language?: string;
  academic_year?: string;
  keywords?: string[];
  status: string;
  visibility?: string;
  institution: string;
  faculty?: string | null;
  department?: string | null;
  program?: string | null;
  supervisor_name?: string;
  scientific_domain?: string;
  submitted_at?: string | null;
  updated_at?: string;
  created_at?: string;
  contributors?: Contributor[];
};

export type Contributor = {
  id?: string;
  work?: string;
  contributor_type: string;
  display_name: string;
  email?: string;
  orcid?: string;
  order_index?: number;
  user?: string | null;
};

export type DocumentVersion = {
  id: string;
  work: string;
  version_number: number;
  version_type: string;
  file: string;
  file_name: string;
  mime_type: string;
  page_count?: number | null;
  sha256_hash: string;
  change_note?: string;
  is_final: boolean;
  status?: string;
  uploaded_by?: string | null;
  created_at?: string;
};

export type MetadataExtraction = {
  id?: string;
  status: string;
  confidence_score?: number;
  metadata?: Record<string, unknown>;
  extracted_title?: string;
  extracted_abstract?: string;
  extracted_keywords?: string[];
  suggested_domain?: string;
  detected_language?: string;
};

export type CatalogItem = {
  public_slug: string;
  work_id: string;
  title: string;
  type: string;
  abstract?: string;
  keywords?: string[];
  institution?: string;
  academic_year?: string;
  scientific_domain?: string;
  access_level?: string;
  is_download_allowed?: boolean;
  archived_at?: string;
  is_verifiable?: boolean;
  document_url?: string;
  file_name?: string;
  page_count?: number | null;
  document_hash?: string;
};

export type Proof = {
  id?: string;
  proof_code?: string;
  document_hash?: string;
  archive_hash?: string;
  version_hash?: string;
  hashes_match?: boolean;
  verification_url?: string;
  qr_code_url?: string;
  status?: string;
  proof_type?: string;
  credential_id?: string;
  credential_status?: string;
  issuer_did?: string;
  schema?: string;
  is_mock?: boolean;
  issued_at?: string;
  proof_status?: string;
  detail?: string;
};

export type VerifyResult = {
  result: "VALID" | "INVALID_HASH" | "NOT_FOUND" | "REVOKED" | "EXPIRED" | "TECHNICAL_ERROR";
  proof_code?: string;
  title?: string;
  author?: string;
  institution?: string;
  work_type?: string;
  document_hash?: string;
  archive_hash?: string;
  version_hash?: string;
  hashes_match?: boolean;
  archived_at?: string;
  proof_status?: string;
  credential_id?: string;
  credential_status?: string;
  issuer_did?: string;
  schema?: string;
  is_mock?: boolean;
  proof_type?: string;
  verification_url?: string;
};

export type AdminProof = Proof & {
  archived_at?: string;
  last_check_result?: string;
  last_checked_at?: string | null;
  work?: {
    id?: string;
    reference_code?: string | null;
    title?: string;
    institution?: string;
    status?: string;
  };
};

export type AssistantSource = {
  work_id?: string;
  title?: string;
  author?: string | null;
  page?: number;
  score?: number;
  excerpt?: string;
  url?: string;
};

export type AssistantResponse = {
  answer_status: "ANSWERED" | "NO_CONTEXT_FOUND" | "FAILED" | string;
  answer?: string | null;
  key_points?: string[];
  sources?: AssistantSource[];
  note?: string;
};

export type SimilarWork = {
  work_id?: string;
  title?: string;
  type?: string;
  year?: string | number | null;
  score?: number;
  motifs?: string[];
};

export type AdminDashboard = {
  kpis?: Record<string, number>;
  services?: Record<string, { status?: string; detail?: string } | string>;
  modes?: Record<string, string>;
  scope?: UserCapabilities;
};

export type AuditEvent = Record<string, unknown> & {
  id: string;
  created_at?: string;
  action_type?: string;
  module?: string;
  severity?: string;
  comment?: string;
};
