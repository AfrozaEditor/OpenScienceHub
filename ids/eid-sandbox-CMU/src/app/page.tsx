"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  // Auto redirect after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-2xl font-bold text-slate-800">
        Redirecting to Dashboard…
      </h1>

      <button
        onClick={() => router.push("/dashboard")}
        className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl
                   hover:bg-purple-700 transition-all"
      >
        Go to Dashboard
      </button>

      <p className="text-sm text-slate-400">
        You’ll be redirected automatically or click the button above.
      </p>
    </div>
  );
}
