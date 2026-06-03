import { restFetch } from "@/utils/restClient";
import type { SendInviteEmailPayload, SendInviteEmailResponse } from "@/types/sendmail";

/* ---------------- SEND INVITE EMAIL ---------------- */

export const sendInviteEmail = (payload: SendInviteEmailPayload) =>
  restFetch<SendInviteEmailResponse>(
    "/email/send-invite-url",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
