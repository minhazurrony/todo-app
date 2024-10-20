declare namespace NodeJS {
  interface ProcessEnv {
    TZ?: string;
    PORT?: number;
    DATABASE_URL?: string;
    JWT_SECRET?: string;
  }
}
