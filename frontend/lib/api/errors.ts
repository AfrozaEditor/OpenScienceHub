import type { ApiErrorPayload } from "./types";

export class ApiError extends Error {
  status: number;
  payload: ApiErrorPayload | null;

  constructor(status: number, payload: ApiErrorPayload | null, fallback: string) {
    super(payload?.detail || fallback);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

export function messageForApiError(error: unknown): string {
  if (!(error instanceof ApiError)) {
    if (error instanceof Error && error.message) return error.message;
    return "Une erreur inattendue est survenue.";
  }
  if (error.payload?.detail) return error.payload.detail;
  if (error.payload?.errors) {
    const first = Object.values(error.payload.errors)[0]?.[0];
    if (first) return first;
  }
  switch (error.status) {
    case 400:
      return "La requête est invalide. Vérifiez les champs saisis.";
    case 401:
      return "Votre session a expiré. Veuillez vous reconnecter.";
    case 403:
      return "Vous n'avez pas les droits nécessaires pour cette action.";
    case 404:
      return "La ressource demandée est introuvable.";
    case 409:
      return "Cette action est incompatible avec l'état actuel du dossier.";
    case 422:
      return "Certaines conditions métier ne sont pas remplies.";
    case 502:
      return "Un service externe est indisponible. Réessayez dans quelques instants.";
    default:
      return `Erreur serveur (${error.status}).`;
  }
}
