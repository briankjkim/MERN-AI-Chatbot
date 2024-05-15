import { Router } from "express";
import {
  getAllUsers,
  userLogin,
  userSignUp,
  verifyUser,
} from "../controllers/user-controllers.js";
import {
  logingValidator,
  signupValidator,
  validate,
} from "../utils/validators.js";
import { verifyToken } from "../utils/token-manager.js";

const userRoutes = Router();

userRoutes.get("/", getAllUsers);
userRoutes.post("/signup", validate(signupValidator), userSignUp);
userRoutes.post("/login", validate(logingValidator), userLogin);
userRoutes.get("/auth-status", verifyToken, verifyUser);

export default userRoutes;
