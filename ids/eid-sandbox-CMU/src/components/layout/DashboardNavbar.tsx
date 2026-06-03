"use client";

import { useState } from "react";
import Image from "next/image";
import { Bell, Search, X } from "lucide-react";

export function DashboardNavbar() {
  const [showBanner, setShowBanner] = useState(true);

  return (
    <div className="sticky top-0 z-50 w-full flex flex-col">
      {/* 1. BLUE PROMO BANNER (As seen in image_4cc4a0.png) */}
      {showBanner && (
        <div className="w-full bg-[#3B59DA] text-white px-8 py-3 flex items-center justify-between transition-all">
          <div className="flex flex-col">
            <h2 className="text-sm font-bold tracking-wide">
              Interoperable credential System
            </h2>
            <p className="text-[11px] opacity-90 font-medium">
              Your issued credentials can be verified by any verifier in the
              ecosystem using SSI standards
            </p>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="p-1 hover:bg-white/10 rounded-md transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* 2. MAIN SEARCH & PROFILE BAR */}
      <header className="w-full border-b border-slate-100 bg-white px-8 py-3">
        <div className="flex h-12 items-center justify-between">
          {/* Search Input Area */}
          <div className="relative text-black w-full max-w-md">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search Tasks"
              className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B18B8]/20 focus:border-[#5B18B8] transition-all"
            />
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-6">
            {/* Notification Bell */}
            <button className="relative p-1 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell size={22} />
            </button>

            {/* Profile Avatar with Badge */}
            <button className="relative group active:scale-95 transition-all">
              <div className="h-10 w-10 rounded-full border-2 border-purple-500 p-0.5 overflow-hidden">
                <div className="h-full w-full rounded-full overflow-hidden bg-slate-100 relative">
                  <Image
                    src="/icons/issuer.png"
                    alt="User Avatar"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              {/* Notification Badge */}
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 border-2 border-white text-[10px] font-bold text-white">
                2
              </span>
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}
