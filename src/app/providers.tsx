import { useEffect, useState, type PropsWithChildren } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSession, signOut, supabase } from "../lib/supabase/auth";
import { AuthContext } from "./auth-context";

export function AppProviders({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function refreshSession() {
    setIsLoading(true);
    const { data } = await getSession();
    setSession(data.session ?? null);
    setIsLoading(false);
  }

  async function signOutUser() {
    await signOut();
    setSession(null);
  }

  useEffect(() => {
    void refreshSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, nextSession) => {
      setSession(nextSession);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    userId: session?.user.id ?? null,
    email: session?.user.email ?? null,
    isAuthenticated: Boolean(session),
    isLoading,
    refreshSession,
    signOutUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
