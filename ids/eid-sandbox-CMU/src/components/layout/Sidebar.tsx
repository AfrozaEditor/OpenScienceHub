"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import {
  LayoutDashboard,
  Award,
  FileText,
  Users,
  CheckCircle,
  Settings,
  BarChart3,
  History,
  ChevronDown,
  LogOut,
  Building2,
  Zap, // Added for "Try it yourself"
} from "lucide-react";

 
/* ---------------- NAV CONFIGURATION ---------------- */
// Defining all links in one place now
const NAVIGATION_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Issue Credentials", href: "/dashboard/issueCredential", icon: Award },
  { label: "Verify Credential", href: "/dashboard/verifyCredential", icon: CheckCircle },
  { label: "Templates", href: "/dashboard/templates", icon: FileText },
  { label: "Try It Yourself", href:`${process.env.NEXT_PUBLIC_TRY_IT_YOURSELF_URL}`, icon: Zap },
  { label: "Bulk Issuance", href: "/dashboard/bulk", icon: Users },
  { label: "Settings", href: "#", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
 
   

  return (
    <aside className="w-64 bg-white border-r border-gray-100 min-h-screen flex flex-col shadow-sm">
      {/* Brand Header */}
      <div className="p-4 flex items-center gap-3">
        <img
          className="w-32 h-10"
          src="/icons/Logo_Main.png"
          alt="TrustCreds"
        />
        <div>
          <h1 className="text-sm font-bold text-gray-900 leading-none">
            TrustCreds
          </h1>
          <p className="text-[10px] text-gray-500 font-medium font-sans">
            SSI Ecosystem
          </p>
        </div>
      </div>

      {/* Profile/Context Selector */}
      <div className="px-4 my-2">
        <button className="group w-full flex items-center gap-3 p-3 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-purple-200 hover:shadow-xl hover:shadow-purple-50 transition-all duration-300">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-gray-200 group-hover:border-purple-100 shadow-sm transition-colors">
            <Building2 size={18} className="text-purple-600" />
          </div>

          <div className="flex flex-col items-start overflow-hidden">
            <span className="text-[12px] font-bold text-gray-800 truncate">
              Organisation
            </span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              Admin
            </span>
          </div>
          <ChevronDown
            size={14}
            className="ml-auto text-gray-400 group-hover:text-purple-500 transition-colors"
          />
        </button>
      </div>

      <div className="px-6 py-4">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      {/* Navigation */}
      <div className="px-3 flex-1 overflow-y-auto">
        <h2 className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-4">
          Main Menu
        </h2>
        <nav className="space-y-1.5">
          {NAVIGATION_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={clsx(
                  "group flex items-center justify-between px-4 py-3 rounded-2xl text-sm transition-all duration-300",
                  isActive
                    ? "bg-gradient-to-br from-purple-600 to-purple-800 text-white shadow-lg shadow-purple-200"
                    : "text-gray-600 hover:bg-purple-50 hover:text-purple-700",
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={20}
                    strokeWidth={isActive ? 2.5 : 2}
                    className={clsx(
                      "transition-colors duration-300",
                      isActive
                        ? "text-white"
                        : "text-gray-400 group-hover:text-purple-600",
                    )}
                  />
                  <span
                    className={clsx(
                      "text-[13px] transition-all",
                      isActive ? "font-bold tracking-tight" : "font-semibold",
                    )}
                  >
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Logout */}
      <div className="p-4 mt-auto border-t border-gray-100 bg-gray-50/30">
       
      </div>
    </aside>
  );
}
