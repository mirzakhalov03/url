import { Router } from "express";
import { createShortLink, getUserLinks, deleteLink } from "../controllers/url.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post("/", authenticate, createShortLink);
router.get("/", authenticate, getUserLinks);
router.delete("/:id", authenticate, deleteLink);

export default router;
