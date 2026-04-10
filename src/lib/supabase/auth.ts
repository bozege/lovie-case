import { supabase } from "./client";

export { supabase };

export async function sendMagicLink(email: string) {
  return supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: window.location.origin,
    },
  });
}

export async function getSession() {
  return supabase.auth.getSession();
}

export async function signOut() {
  return supabase.auth.signOut();
}
