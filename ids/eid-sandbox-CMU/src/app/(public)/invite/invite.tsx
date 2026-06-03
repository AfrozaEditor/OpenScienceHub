"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function InviteRedirectPage() {
  const searchParams = useSearchParams();

  // shortUrl is URL-ENCODED in the web link
  const encodedshortUrl = searchParams.get("shortUrl");
  const type = searchParams.get("type") || "offer";

  // ✅ DECODE before building deep link
  const decodedshortUrl = encodedshortUrl
    ? decodeURIComponent(encodedshortUrl)
    : null;

  const deepLink = decodedshortUrl
    ? `polyid://invite?shortUrl=${decodedshortUrl}&type=${type}`
    : "";

  const playStoreUrl =
    "https://play.google.com/store/apps/details?id=com.polyid.app";

  const appStoreUrl =
    "https://apps.apple.com/app/idXXXXXXXXX"; // replace

  useEffect(() => {
    if (!deepLink) return;

    const ua = navigator.userAgent.toLowerCase();
    const isAndroid = /android/.test(ua);
    const isIOS = /iphone|ipad|ipod/.test(ua);

    // Attempt to open app
    window.location.href = deepLink;

    // Fallback
    const timer = setTimeout(() => {
      if (isAndroid) {
        window.location.href = playStoreUrl;
      } else if (isIOS) {
        window.location.href = appStoreUrl;
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [deepLink]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center">
      <div className="max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Open PolyID App
        </h1>

        <p className="text-gray-500 text-sm">
          We tried to open the PolyID app automatically.
          <br />
          If it didn’t work, use the options below.
        </p>

        <div className="flex flex-col gap-3 mt-4">
          <a
            href={deepLink}
            className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition"
          >
            Open in App
          </a>

          <a
            href={playStoreUrl}
            className="w-full py-3 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition"
          >
            Download App
          </a>
        </div>

        <p className="text-xs text-gray-400 mt-4">
          Already installed? Tap “Open in App”.
        </p>
      </div>
    </div>
  );
}
