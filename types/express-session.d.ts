import "express-session";

declare module "express-session" {
  interface SessionData {
    user?: {
      id: number;
      email: string;
      password_hash: string;
      full_name: string | null;
    };
  }
}