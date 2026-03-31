import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../database";
import { users, sessions } from "../database/schema";
import { eq } from "drizzle-orm";
import { AuthRequest } from "../middleware/auth";

const generateTokens = (userId: number) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });
  return { accessToken, refreshToken };
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, full_name, password } = req.body;
    if (!email || !full_name || !password) {
      res.status(400).json({ error: "email, full_name, and password are required" });
      return;
    }

    const existing = await db.query.users.findFirst({ where: eq(users.email, email) });
    if (existing) {
      res.status(409).json({ error: "Email already registered" });
      return;
    }

    const password_hash = await bcrypt.hash(password, 10);
    const { accessToken, refreshToken } = generateTokens(0); // temp id

    const [user] = await db.insert(users).values({
      email,
      full_name,
      password_hash,
      access_token: accessToken,
      refresh_token: refreshToken,
    }).returning();

    const tokens = generateTokens(user.id);

    await db.update(users).set({
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
    }).where(eq(users.id, user.id));

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await db.insert(sessions).values({
      user_id: user.id,
      refresh_token: tokens.refreshToken,
      expires_at: expiresAt,
    });

    res.status(201).json({
      user: { id: user.id, email: user.email, full_name: user.full_name },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "email and password are required" });
      return;
    }

    const user = await db.query.users.findFirst({ where: eq(users.email, email) });
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const tokens = generateTokens(user.id);

    await db.update(users).set({
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
    }).where(eq(users.id, user.id));

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await db.insert(sessions).values({
      user_id: user.id,
      refresh_token: tokens.refreshToken,
      expires_at: expiresAt,
    });

    res.json({
      user: { id: user.id, email: user.email, full_name: user.full_name },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).json({ error: "refreshToken is required" });
      return;
    }

    let payload: { userId: number };
    try {
      payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { userId: number };
    } catch {
      res.status(401).json({ error: "Invalid refresh token" });
      return;
    }

    const session = await db.query.sessions.findFirst({
      where: eq(sessions.refresh_token, refreshToken),
    });
    if (!session || session.expires_at < new Date()) {
      res.status(401).json({ error: "Session expired or not found" });
      return;
    }

  
    await db.delete(sessions).where(eq(sessions.id, session.id));

    const tokens = generateTokens(payload.userId);

    await db.update(users).set({
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
    }).where(eq(users.id, payload.userId));

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await db.insert(sessions).values({
      user_id: payload.userId,
      refresh_token: tokens.refreshToken,
      expires_at: expiresAt,
    });

    res.json({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const logout = async (req: AuthRequest, res: Response) => {
  try {
    const header = req.headers.authorization;
    const token = header?.split(" ")[1];
    if (token && req.userId) {
      await db.delete(sessions).where(eq(sessions.user_id, req.userId));
    }
    res.json({ message: "Logged out" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
