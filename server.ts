import express from "express";
import cors, { corsOptions } from "./middleware/cors";
import { setupSwagger } from "./config/swagger";
import authRoutes from "./routes/auth.routes";
import urlRoutes from "./routes/url.routes";
import { redirect } from "./controllers/url.controller";
import { errorHandler, notFoundHandler } from "./middleware/error-handler";
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

setupSwagger(app);

app.get("/", (req, res) => {
  res.send("URL Shortener API is running");
});

// Auth routes
app.use("/api/auth", authRoutes);

// URL routes (CRUD)
app.use("/api/urls", urlRoutes);

// Public redirect route
app.get("/:shortLink", redirect);

// Fallback and error middlewares
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
console.log()