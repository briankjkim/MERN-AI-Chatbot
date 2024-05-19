import { Router } from "express";
import userRoutes from "./user-routes.js";
import chatRoutes from "./chat-routes.js";

const appRouter = Router();

appRouter.get("/", (req, res) => {
  console.log("GET Request made at req.url: ", req.url);
  return res.status(200).json({ message: "Server Online 🤖" });
});
appRouter.use("/user", userRoutes); // domain/api/v1/user
appRouter.use("/chat", chatRoutes); // domain/api/v1/chat

export default appRouter;
