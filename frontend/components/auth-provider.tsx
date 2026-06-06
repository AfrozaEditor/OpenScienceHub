"use client";

import * as React from "react";

import { getMe, login as apiLogin, register as apiRegister } from "@/lib/api/resources";
import { clearStoredTokens, getStoredTokens } from "@/lib/api/session";
import type { CurrentUser } from "@/lib/api/types";

type RegisterPayload = {
  email: string;
  full_name: string;
  password: string;
  institution: string;
  preferred_language?: string;
};

type AuthContextValue = {
  user: CurrentUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<CurrentUser>;
  register: (payload: RegisterPayload) => Promise<CurrentUser>;
  logout: () => void;
  reload: () => Promise<void>;
  hasRole: (roles: string[]) => boolean;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function roleRedirect(user: CurrentUser | null) {
  if (!user) return "/login";
  const defaultPortal = user.capabilities?.default_portal;
  if (defaultPortal === "admin") return "/admin/dashboard";
  if (defaultPortal === "validation") return "/validation/dashboard";
  if (defaultPortal === "deposant") return "/deposant/dashboard";
  const portals = user.capabilities?.portals || [];
  if (portals.includes("admin")) return "/admin/dashboard";
  if (portals.includes("validation")) return "/validation/dashboard";
  if (portals.includes("deposant")) return "/deposant/dashboard";
  const roleCodes = (user.roles || [])
    .flatMap((r) => [r.role_code, r.code, r.role_label, r.label])
    .filter(Boolean)
    .map((role) => String(role).toLowerCase());
  if (user.is_superuser || roleCodes.some((role) => role.includes("admin"))) {
    return "/admin/dashboard";
  }
  if (roleCodes.some((role) => role.includes("valid") || role.includes("review"))) {
    return "/validation/dashboard";
  }
  return "/deposant/dashboard";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<CurrentUser | null>(null);
  const [loading, setLoading] = React.useState(true);

  const reload = React.useCallback(async () => {
    const tokens = getStoredTokens();
    if (!tokens) {
      setUser(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      setUser(await getMe());
    } catch {
      clearStoredTokens();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void reload();
  }, [reload]);

  const value = React.useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      async login(email, password) {
        await apiLogin(email, password);
        const current = await getMe();
        setUser(current);
        return current;
      },
      async register(payload) {
        return apiRegister(payload);
      },
      logout() {
        clearStoredTokens();
        setUser(null);
        if (typeof window !== "undefined") window.location.assign("/login");
      },
      reload,
      hasRole(roles) {
        if (!user) return false;
        const wanted = roles.map((role) => role.toLowerCase());
        const portals = user.capabilities?.portals?.map((role) => role.toLowerCase()) || [];
        if (wanted.some((role) => portals.includes(role))) return true;
        if (roles.includes("admin") && user.capabilities?.is_platform_admin) return true;
        if (roles.includes("admin") && user.capabilities?.is_institution_admin) return true;
        if (user.is_superuser) return roles.includes("admin");
        return (user.roles || []).some((role) =>
          [role.role_code, role.code, role.role_label, role.label]
            .filter(Boolean)
            .some((value) =>
              wanted.some((wantedRole) => String(value).toLowerCase().includes(wantedRole)),
            ),
        );
      },
    }),
    [loading, reload, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
