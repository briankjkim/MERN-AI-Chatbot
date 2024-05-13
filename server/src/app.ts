import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import appRouter from "./routes/index.js";

// Set up express app
config();
const app = express();

// Middlewares
app.use(express.json());

// FIXME: For Dev Only: remove in production
app.use(morgan("dev"));

app.use("/api/v1", appRouter);

export default app;
