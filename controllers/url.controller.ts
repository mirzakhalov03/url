import { Request, Response } from "express";
import { nanoid } from "nanoid";
import { db } from "../database";
import { urls } from "../database/schema";
import { eq, and } from "drizzle-orm";
import { AuthRequest } from "../middleware/auth";

export const createShortLink = async (req: AuthRequest, res: Response) => {
  try {
    const { original_link } = req.body;
    if (!original_link) {
      res.status(400).json({ error: "original_link is required" });
      return;
    }

    const short_link = nanoid(8);

    const [link] = await db.insert(urls).values({
      user_id: req.userId!,
      original_link,
      short_link,
    }).returning();

    res.status(201).json(link);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserLinks = async (req: AuthRequest, res: Response) => {
  try {
    const links = await db.query.urls.findMany({
      where: eq(urls.user_id, req.userId!),
      orderBy: (urls, { desc }) => [desc(urls.created_at)],
    });

    res.json(links);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const redirect = async (req: Request, res: Response) => {
  try {
    const shortLink = req.params.shortLink as string;

    const link = await db.query.urls.findFirst({
      where: (urls, { eq }) => eq(urls.short_link, shortLink),
    });

    if (!link) {
      res.status(404).json({ error: "Short link not found" });
      return;
    }

    res.redirect(link.original_link);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteLink = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);

    const [deleted] = await db.delete(urls)
      .where(and(eq(urls.id, id), eq(urls.user_id, req.userId!)))
      .returning();

    if (!deleted) {
      res.status(404).json({ error: "Link not found" });
      return;
    }

    res.json({ message: "Deleted", link: deleted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
