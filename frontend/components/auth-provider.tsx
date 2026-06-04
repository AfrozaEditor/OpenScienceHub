"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { clearStoredTokens, getMe, getStoredTokens, login as apiLogin, register as apiRegister } from "@/lib/api";
import type { CurrentUser } from "@/lib/api";

type RegisterPayload = {
  email: string;
  full_name: string;
  password: string;
  institution?: string;
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
  const roleCodes = (user.roles || [])
    .flatMap((r) => [r.role_code, r.code, r.role, r.label])
    .filter(Boolean)
    .map((role) => String(role).toLowerCase());
  if (user.is_staff || user.is_superuser || roleCodes.some((role) => role.includes("admin"))) {
    return "/admin/dashboard";
  }
  if (roleCodes.some((role) => role.includes("valid") || role.includes("review"))) {
    return "/validation/dashboard";
  }
  return "/deposant/dashboard";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
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
        router.replace("/login");
      },
      reload,
      hasRole(roles) {
        if (!user) return false;
        if (user.is_staff || user.is_superuser) return roles.includes("admin");
        const wanted = roles.map((role) => role.toLowerCase());
        return (user.roles || []).some((role) =>
          [role.role_code, role.code, role.role, role.label]
            .filter(Boolean)
            .some((value) =>
              wanted.some((wantedRole) => String(value).toLowerCase().includes(wantedRole)),
            ),
        );
      },
    }),
    [loading, reload, router, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
