declare module '../config.json' {
  interface Config {
    supabase: {
      url: string;
      anonKey: string;
    };
  }

  const config: Config;
  export default config;
}
