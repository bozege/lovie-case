import { createClient } from "@supabase/supabase-js";
import { supabaseEnv } from "./env";

export const supabase = createClient(supabaseEnv.url, supabaseEnv.anonKey);
