import express from "express";
import cors, { corsOptions } from "./middleware/cors";
import { setupSwagger } from "./config/swagger";
import authRoutes from "./routes/auth";
import urlRoutes from "./routes/url.routes";
import { redirect } from "./controllers/url.controller";
import dotenv from "dotenv";
import session from "express-session";
import loginRoutes from "./routes/login";
import logoutRoutes from "./routes/logout";
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
app.use(
  session({
    secret: "for_the_emperor",
    resave: false,
    saveUninitialized: false,
  })
);
app.get('/', (req, res) => {
    res.send("URL Shortener API is running")
})
app.use('/auth', authRoutes);
app.use('/login', loginRoutes);
app.use('/logout', logoutRoutes);

// URL routes (CRUD)
app.use("/api/urls", urlRoutes);

// Public redirect route
app.get("/:shortLink", redirect);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
console.log()