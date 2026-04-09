function getEnv(name: string) {
  const value = import.meta.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const supabaseEnv = {
  url: getEnv("VITE_SUPABASE_URL"),
  anonKey: getEnv("VITE_SUPABASE_ANON_KEY"),
};
