"use client";

import { useMutation } from "@tanstack/react-query";
import { sendInviteEmail } from "@/api/sendmail";
import type {
  SendInviteEmailPayload,
  SendInviteEmailResponse,
} from "@/types/sendmail";

export function useSendInviteEmail() {
  return useMutation<
    SendInviteEmailResponse,
    Error,
    SendInviteEmailPayload
  >({
    mutationFn: async (payload) => {
      return await sendInviteEmail(payload);
    },
  });
}
