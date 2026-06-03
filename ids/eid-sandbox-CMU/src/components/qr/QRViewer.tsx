"use client";

import QRCode from "react-qr-code";
import { useEffect, useState } from "react";

interface QRViewerProps {
  shortUrl?: string;
  verificationQr?: string;
  expiresIn?: number; // optional, fallback handled
}

export default function QRViewer({
  shortUrl,
  verificationQr,
  expiresIn = 120, // ✅ default 2 minutes
}: QRViewerProps) {
  const [time, setTime] = useState<number>(expiresIn);

  // ⏱ Safe countdown (never goes negative)
  useEffect(() => {
    if (time <= 0) return;

    const i = setInterval(() => {
      setTime((t) => Math.max(t - 1, 0));
    }, 1000);

    return () => clearInterval(i);
  }, [time]);

  // 🛑 Guard against bad data
  if (!shortUrl && !verificationQr) {
    return <p className="text-center text-red-500">Invalid QR data</p>;
  }

  return (
    <div className="text-center space-y-4 text-black/80">
      <h1 className="text-xl font-semibold">Sign in</h1>

      <p className="text-sm text-gray-500">
        A secure platform to store and manage your digital credentials.
      </p>

      <div className="flex justify-center">
        {verificationQr ? (
          <img
            src={verificationQr}
            alt="Login QR"
            className="w-[220px] h-[220px]"
          />
        ) : (
          <QRCode value={shortUrl!} size={220} />
        )}
      </div>

      <p className="text-xs text-gray-500">
        {time > 0 ? `Expires in ${time}s` : "QR expired"}
      </p>
    </div>
  );
}
