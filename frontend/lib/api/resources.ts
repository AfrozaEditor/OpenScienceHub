import { apiRequest, toQuery } from "./client";
import { endpoints } from "./endpoints";
import { setStoredTokens } from "./session";
import type {
  AdminDashboard,
  AuditEvent,
  AssistantResponse,
  AuthTokens,
  CatalogItem,
  CurrentUser,
  Department,
  DocumentVersion,
  Faculty,
  Institution,
  MetadataExtraction,
  Paginated,
  Proof,
  SimilarWork,
  VerifyResult,
  Work,
  Contributor,
} from "./types";

export async function login(email: string, password: string) {
  const tokens = await apiRequest<AuthTokens>(endpoints.auth.login, {
    method: "POST",
    auth: false,
    body: JSON.stringify({ email, password }),
  });
  setStoredTokens(tokens);
  return tokens;
}

export function register(payload: {
  email: string;
  full_name: string;
  password: string;
  institution?: string;
  preferred_language?: string;
}) {
  return apiRequest<CurrentUser>(endpoints.auth.register, {
    method: "POST",
    auth: false,
    body: JSON.stringify(payload),
  });
}

export function getMe() {
  return apiRequest<CurrentUser>(endpoints.auth.me);
}

export function listInstitutions() {
  return apiRequest<Paginated<Institution> | Institution[]>(endpoints.institutions, { auth: false });
}

export function listFaculties(institution?: string) {
  return apiRequest<Paginated<Faculty> | Faculty[]>(
    `${endpoints.faculties}${toQuery({ institution })}`,
    { auth: false },
  );
}

export function listDepartments(faculty?: string) {
  return apiRequest<Paginated<Department> | Department[]>(
    `${endpoints.departments}${toQuery({ faculty })}`,
    { auth: false },
  );
}

export function listPrograms(params: Record<string, string | number | boolean | undefined> = {}) {
  return apiRequest<Paginated<Record<string, unknown>> | Record<string, unknown>[]>(
    `${endpoints.programs}${toQuery(params)}`,
  );
}

export function listWorks(params: Record<string, string | number | boolean | undefined> = {}) {
  return apiRequest<Paginated<Work>>(`${endpoints.works.list}${toQuery(params)}`);
}

export function getWork(id: string) {
  return apiRequest<Work>(endpoints.works.detail(id));
}

export function createWork(payload: Partial<Work>) {
  return apiRequest<Work>(endpoints.works.list, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateWork(id: string, payload: Partial<Work>) {
  return apiRequest<Work>(endpoints.works.detail(id), {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function addContributor(workId: string, payload: Contributor) {
  return apiRequest<Contributor>(endpoints.works.contributors(workId), {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function uploadDocument(workId: string, file: File, changeNote = "") {
  const form = new FormData();
  form.set("file", file);
  if (changeNote) form.set("change_note", changeNote);
  return apiRequest<DocumentVersion>(endpoints.works.documents(workId), {
    method: "POST",
    body: form,
  });
}

export function listDocuments(workId: string) {
  return apiRequest<DocumentVersion[]>(endpoints.works.documents(workId));
}

export function extractMetadata(workId: string) {
  return apiRequest<MetadataExtraction>(endpoints.works.extractMetadata(workId), {
    method: "POST",
  });
}

export function getMetadataExtraction(workId: string) {
  return apiRequest<MetadataExtraction>(endpoints.works.metadataExtraction(workId));
}

export function acceptMetadata(
  workId: string,
  payload: { title?: string; abstract_text?: string; scientific_domain?: string; keywords?: string[] },
) {
  return apiRequest<{ detail: string; work_id: string }>(endpoints.works.acceptMetadata(workId), {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function submitWork(workId: string) {
  return apiRequest<Work>(endpoints.works.submit(workId), { method: "POST" });
}

export function getWorkProof(workId: string) {
  return apiRequest<Proof>(endpoints.works.proof(workId));
}

export function getWorkSummary(workId: string) {
  return apiRequest<Record<string, unknown>>(endpoints.works.summary(workId), { auth: false });
}

export function archiveWork(workId: string, payload = { access_level: "OPEN_ACCESS", is_download_allowed: true }) {
  return apiRequest<CatalogItem>(endpoints.works.archive(workId), {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function assignWork(workId: string, payload: Record<string, unknown> = {}) {
  return apiRequest<Record<string, unknown>>(endpoints.works.assignments(workId), {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function addReview(workId: string, payload: Record<string, unknown>) {
  return apiRequest<Record<string, unknown>>(endpoints.works.reviews(workId), {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function listReviews(workId: string) {
  return apiRequest<Record<string, unknown>[]>(endpoints.works.reviews(workId));
}

export function addCorrection(workId: string, payload: Record<string, unknown>) {
  return apiRequest<Record<string, unknown>>(endpoints.works.corrections(workId), {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function listCorrections(workId: string) {
  return apiRequest<Record<string, unknown>[]>(endpoints.works.corrections(workId));
}

export function updateCorrection(correctionId: string, payload: Record<string, unknown>) {
  return apiRequest<Record<string, unknown>>(`/corrections/${correctionId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function validateWorkMetadata(workId: string, payload: Record<string, unknown> = {}) {
  return apiRequest<Record<string, unknown>>(endpoints.works.validateMetadata(workId), {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function decideWork(workId: string, payload: Record<string, unknown>) {
  return apiRequest<Record<string, unknown>>(endpoints.works.decision(workId), {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function createDefense(workId: string, payload: Record<string, unknown>) {
  return apiRequest<Record<string, unknown>>(`/works/${workId}/defense`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function listCatalog(params: Record<string, string | number | boolean | undefined> = {}) {
  return apiRequest<Paginated<CatalogItem>>(`${endpoints.catalog.list}${toQuery(params)}`, { auth: false });
}

export function searchCatalog(params: Record<string, string | number | boolean | undefined> = {}) {
  return apiRequest<Paginated<CatalogItem>>(`${endpoints.catalog.search}${toQuery(params)}`, { auth: false });
}

export function getCatalogFacets() {
  return apiRequest<Record<string, Record<string, number>>>(endpoints.catalog.facets, { auth: false });
}

export function getCatalogItem(slug: string) {
  return apiRequest<CatalogItem>(endpoints.catalog.detail(slug), { auth: false });
}

export function verifyProof(proofCode: string) {
  return apiRequest<VerifyResult>(endpoints.verify(proofCode), { auth: false });
}

export function askAssistant(question: string, filters: Record<string, unknown> = {}) {
  return apiRequest<AssistantResponse>(endpoints.ai.assistant, {
    method: "POST",
    body: JSON.stringify({ question, filters }),
  });
}

export function getSimilarWorks(workId: string) {
  return apiRequest<{ results: SimilarWork[] }>(endpoints.works.similar(workId), { auth: false });
}

export function getValidationInbox(params: Record<string, string | number | boolean | undefined> = {}) {
  return apiRequest<Paginated<Work>>(`${endpoints.validation.inbox}${toQuery(params)}`);
}

export function getAdminDashboard() {
  return apiRequest<AdminDashboard>(endpoints.admin.dashboard);
}

export function getAdminStats() {
  return apiRequest<Record<string, unknown>>(endpoints.admin.stats);
}

export function getAdminAudit() {
  return apiRequest<Paginated<AuditEvent> | AuditEvent[]>(endpoints.admin.audit);
}

export function getAdminAiSettings() {
  return apiRequest<Record<string, unknown>>(endpoints.admin.aiSettings);
}

export function getAdminSearchSettings() {
  return apiRequest<Record<string, unknown>>(endpoints.admin.searchSettings);
}

export function listDocumentTypes() {
  return apiRequest<Paginated<Record<string, unknown>> | Record<string, unknown>[]>(
    endpoints.admin.documentTypes,
  );
}

export function listWorkflows(params: Record<string, string | number | boolean | undefined> = {}) {
  return apiRequest<Paginated<Record<string, unknown>> | Record<string, unknown>[]>(
    `${endpoints.admin.workflows}${toQuery(params)}`,
  );
}

export function listWorkflowSteps(workflow?: string) {
  return apiRequest<Paginated<Record<string, unknown>> | Record<string, unknown>[]>(
    `${endpoints.admin.workflowSteps}${toQuery({ workflow })}`,
  );
}

export function listWorkflowTransitions(workflow?: string) {
  return apiRequest<Paginated<Record<string, unknown>> | Record<string, unknown>[]>(
    `${endpoints.admin.workflowTransitions}${toQuery({ workflow })}`,
  );
}

export function getSsiConnection(institution?: string) {
  return apiRequest<Record<string, unknown>>(`${endpoints.admin.ssiConnection}${toQuery({ institution })}`);
}

export function testSsiConnection(institution?: string) {
  return apiRequest<Record<string, unknown>>(endpoints.admin.ssiTestConnection, {
    method: "POST",
    body: JSON.stringify(institution ? { institution } : {}),
  });
}

export function updateSsiConnection(payload: Record<string, unknown>) {
  return apiRequest<Record<string, unknown>>(endpoints.admin.ssiConnection, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function revokeProof(id: string, reason: string) {
  return apiRequest<Record<string, unknown>>(endpoints.ssi.revoke(id), {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

export function reissueProof(id: string) {
  return apiRequest<Record<string, unknown>>(endpoints.ssi.reissue(id), {
    method: "POST",
  });
}

export function listAdminUsers() {
  return apiRequest<Paginated<CurrentUser> | CurrentUser[]>(endpoints.accounts.users);
}

export function listRoles() {
  return apiRequest<Paginated<Record<string, unknown>> | Record<string, unknown>[]>(
    endpoints.accounts.roles,
  );
}

export function listPermissions() {
  return apiRequest<Paginated<Record<string, unknown>> | Record<string, unknown>[]>(
    endpoints.accounts.permissions,
  );
}

export function listUserRoles(id: string) {
  return apiRequest<Record<string, unknown>[]>(endpoints.accounts.userRoles(id));
}

export function createAdminUser(payload: Record<string, unknown>) {
  return apiRequest<CurrentUser>(endpoints.accounts.users, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateAdminUser(id: string, payload: Record<string, unknown>) {
  return apiRequest<CurrentUser>(`${endpoints.accounts.users}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteAdminUser(id: string) {
  return apiRequest<void>(`${endpoints.accounts.users}/${id}`, {
    method: "DELETE",
  });
}
