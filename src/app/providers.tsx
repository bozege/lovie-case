import { useEffect, useState, type PropsWithChildren } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSession, signOut, supabase } from "../lib/supabase/auth";
import { clearE2eSession, isE2eMode, readE2eSession, type E2eSession } from "../lib/e2e-mode";
import { AuthContext } from "./auth-context";

export function AppProviders({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [e2eSession, setE2eSession] = useState<E2eSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function refreshSession() {
    if (isE2eMode) {
      setE2eSession(readE2eSession());
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const { data } = await getSession();
    setSession(data.session ?? null);
    setIsLoading(false);
  }

  async function signOutUser() {
    if (isE2eMode) {
      clearE2eSession();
      setE2eSession(null);
      return;
    }

    await signOut();
    setSession(null);
  }

  useEffect(() => {
    void refreshSession();

    if (isE2eMode) {
      return undefined;
    }

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

  const activeUser = isE2eMode
    ? e2eSession
    : {
        userId: session?.user.id ?? null,
        email: session?.user.email ?? null,
      };

  const value = {
    userId: activeUser?.userId ?? null,
    email: activeUser?.email ?? null,
    isAuthenticated: Boolean(activeUser?.email),
    isLoading,
    refreshSession,
    signOutUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
