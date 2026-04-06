import { Request, Response } from "express";
import { nanoid } from "nanoid";
import { db } from "../database";
import { urls } from "../database/schema";
import { eq, and } from "drizzle-orm";
import { AuthRequest } from "../middleware/auth";
import { getErrorMessage, sendError } from "../services/error-response";

export const createShortLink = async (req: AuthRequest, res: Response) => {
  try {
    const { original_link } = req.body;
    if (!original_link) {
      sendError(res, 400, "Please provide a URL to shorten.", {
        devMessage: "Missing required field: original_link",
        code: "VALIDATION_ERROR",
      });
      return;
    }

    if (!/^https?:\/\//.test(original_link)) {
      sendError(res, 400, "Please enter a valid URL starting with http:// or https://.", {
        devMessage: "Invalid original_link format",
        code: "VALIDATION_ERROR",
      });
      return;
    }

    const short_link = nanoid(8);

    const [link] = await db
      .insert(urls)
      .values({
        original_link,
        short_link,
        user_id: req.userId ?? null,
      })
      .returning();

    res.status(201).json(link);
  } catch (err) {
    console.error(err);
    sendError(res, 500, "Something went wrong while creating the short link.", {
      devMessage: getErrorMessage(err),
      code: "INTERNAL_ERROR",
    });
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
    sendError(res, 500, "Unable to load your links right now.", {
      devMessage: getErrorMessage(err),
      code: "INTERNAL_ERROR",
    });
  }
};

export const redirect = async (req: Request, res: Response) => {
  try {
    const shortLink = req.params.shortLink as string;

    const link = await db.query.urls.findFirst({
      where: (urls, { eq }) => eq(urls.short_link, shortLink),
    });

    if (!link) {
      sendError(res, 404, "This short link does not exist.", {
        devMessage: `No URL found for short link: ${shortLink}`,
        code: "NOT_FOUND",
      });
      return;
    }

    res.redirect(link.original_link);
  } catch (err) {
    console.error(err);
    sendError(res, 500, "Unable to open that link right now.", {
      devMessage: getErrorMessage(err),
      code: "INTERNAL_ERROR",
    });
  }
};

export const deleteLink = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);

    const [deleted] = await db
      .delete(urls)
      .where(and(eq(urls.id, id), eq(urls.user_id, req.userId!)))
      .returning();

    if (!deleted) {
      sendError(res, 404, "We could not find that link.", {
        devMessage: `No link found for id=${id} and userId=${req.userId}`,
        code: "NOT_FOUND",
      });
      return;
    }

    res.json({ message: "Deleted", link: deleted });
  } catch (err) {
    console.error(err);
    sendError(res, 500, "Unable to delete the link right now.", {
      devMessage: getErrorMessage(err),
      code: "INTERNAL_ERROR",
    });
  }
};
