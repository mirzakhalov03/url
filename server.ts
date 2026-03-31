import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import urlRoutes from "./routes/url.routes";
import { redirect } from "./controllers/url.controller";

dotenv.config();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("URL Shortener API is running");
});

// Auth routes
app.use("/api/auth", authRoutes);

// URL routes (CRUD)
app.use("/api/urls", urlRoutes);

// Public redirect route
app.get("/:shortLink", redirect);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
