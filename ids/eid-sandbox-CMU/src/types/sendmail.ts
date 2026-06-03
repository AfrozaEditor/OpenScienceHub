export type InviteType = "proof" | "offer" | "connection";

export interface SendInviteEmailPayload {
  email: string;
  inviteLink: string;
  name: string;
  type: InviteType;
}

export interface SendInviteEmailResponse {
  success: boolean;
  message?: string;
}
