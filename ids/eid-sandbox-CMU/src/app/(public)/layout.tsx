// app/(public)/layout.tsx

import React from "react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white gap-4 py-4 md:py-4">
      {/* Left Section - Gradient Background */}
      <div
        className="w-full md:w-1/2 
        flex flex-col justify-end 
        p-8 md:p-12 
        rounded-2xl md:rounded-3xl 
        text-black/80
      bg-[radial-gradient(ellipse_140%_140%_at_85%_20%,#8B5CF6_0%,#8B5CF6_22%,#EDE9FE_55%,#F5F3FF_100%)] "
      >
        <p className="text-sm md:text-base font-semibold mb-2">
          You can easily
        </p>
        <h2 className="text-2xl md:text-3xl font-bold leading-tight">
          Store, manage, and access
          <br />
          your digital credentials safely
          <br />
          in one place.
        </h2>
      </div>

      {/* Right Section - Content */}
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md px-4 md:px-6">{children}</div>
      </div>
    </div>
  );
}
