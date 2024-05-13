import User from "../models/User.js";
import { NextFunction, Request, Response } from "express";

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find();
    return res.status(200).json({ message: "OK", users });
  } catch (error) {
    console.log("Error: ", error);
    return res.status(200).json({ message: "Error", cause: error.message });
  }
};
