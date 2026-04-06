import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { sendError } from "../services/error-response";

export interface AuthRequest extends Request {
  userId?: number;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    sendError(res, 401, "Please sign in to continue.", {
      devMessage: "Authorization header missing or malformed",
      code: "AUTH_MISSING_TOKEN",
    });
    return;
  }

  const token = header.split(" ")[1]; 
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
    req.userId = payload.userId;
    next();
  } catch {
    sendError(res, 401, "Your session is invalid or expired. Please sign in again.", {
      devMessage: "Access token verification failed",
      code: "AUTH_INVALID_TOKEN",
    });
  }
};

export const optionalAuthenticate = (req: AuthRequest, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    next();
    return;
  }

  const token = header.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
    req.userId = payload.userId;
  } catch {
    // Ignore invalid token for guest-capable endpoints.
    req.userId = undefined;
  }

  next();
};
