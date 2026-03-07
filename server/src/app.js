import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Health route
app.get("/", (req, res) => {
  res.json({ message: "CollabNotes API is running" });
});

// Routes
app.use("/api/auth", authRoutes);

export default app;