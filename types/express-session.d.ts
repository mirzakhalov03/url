import "express-session";

declare module "express-session" {
  interface SessionData {
    user?: {
      email: string;
      password_hash: string;
      full_name: string | null;
    };
  }
}