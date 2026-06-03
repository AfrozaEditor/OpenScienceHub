"use client";

interface IssuanceQRProps {
  invitationQr?: string;
  shortUrl?: string;
}

export default function IssuanceQR({
  invitationQr,
  shortUrl,
}: IssuanceQRProps) {
  if (!invitationQr && !shortUrl) {
    return (
      <p className="text-center text-black/80">Invalid issuance QR data</p>
    );
  }

  return (
    <div className="text-center space-y-4 text-black/80">
      <h1 className="text-xl font-semibold">Save your credential</h1>

      <p className="text-sm text-gray-500">
        Scan this QR with your wallet to securely store your credential.
      </p>

      <div className="flex justify-center">
        {invitationQr ? (
          <img
            src={invitationQr}
            alt="Credential Issuance QR"
            className="w-64 h-64"
          />
        ) : (
          <p className="text-xs break-all">{shortUrl}</p>
        )}
      </div>

      <p className="text-xs text-gray-400">This step is required only once.</p>
    </div>
  );
}
