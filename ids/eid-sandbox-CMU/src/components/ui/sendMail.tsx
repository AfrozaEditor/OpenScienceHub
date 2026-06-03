"use client";

import { useState } from "react";
import { X, Mail } from "lucide-react";
import { useSendInviteEmail } from "@/hooks/useSendMail";
import type { InviteType } from "@/types/sendmail";
import { showToast } from "@/utils/toast";

interface Props {
  open: boolean;
  onClose: () => void;
  inviteUrl: string;
  type?: InviteType; // "proof" | "offer"
  title?: string;
  submitLabel?: string;
}

export default function SendInviteEmailDialog({
  open,
  onClose,
  inviteUrl,
  type = "proof",
  title = "Send Invite via Email",
  submitLabel = "Send Email",
}: Props) {
  const [email, setEmail] = useState("");
  const mutation = useSendInviteEmail();
  const inviteLink = `https://polyid-auth-dashboard.vercel.app/invite?shortUrl=${encodeURIComponent(
    inviteUrl
  )}&type=${type}`;

  // ⛔ Do not render when closed
  if (!open) return null;

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    // 🔑 CRITICAL: stop parent <form> submission
    e.preventDefault();
    e.stopPropagation();

    const authUserRaw = localStorage.getItem("auth_user");
    const authUser = authUserRaw ? JSON.parse(authUserRaw) : null;

    const name =
      authUser?.firstName || authUser?.lastName
        ? `${authUser?.firstName || ""} ${authUser?.lastName || ""}`.trim()
        : "User";

    mutation.mutate(
      {
        email,
        inviteLink: inviteLink, // already deep link / URL passed from parent
        name,
        type,
      },
      {
        onSuccess: () => {
          showToast("Email sent successfully", "success");
          setEmail("");
          onClose();
        },
        onError: () => {
          showToast("Failed to send email. Please try again.", "error");
        },
      }
    );
  };

  return (
    <div
      className="fixed inset-0 z-60 bg-black/40 flex items-center justify-center"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md p-6 animate-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">{title}</h3>
          <button type="button" onClick={onClose}>
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Email Input */}
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="email"
            placeholder="Enter recipient email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-100 focus:border-purple-600 outline-none"
          />
        </div>

        {/* Send Button */}
        <button
          type="button" // 🔥 MOST IMPORTANT LINE
          onClick={handleSubmit}
          disabled={!email || mutation.isPending}
          className="mt-6 w-full bg-[#6f1ce3] text-white py-3 rounded-xl font-bold hover:bg-[#5B18B8] transition disabled:opacity-50"
        >
          {mutation.isPending ? "Sending..." : submitLabel}
        </button>
      </div>
    </div>
  );
}
