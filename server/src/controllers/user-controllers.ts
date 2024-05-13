import { compare, hash } from "bcrypt";
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

export const userSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(401).send("User already registered.");
    const hashedPassword = await hash(password, 12);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    return res.status(201).json({ message: "OK", id: newUser._id.toString() });
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({ message: "Error", cause: error.message });
  }
};

export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(401).send("User not found.");
    }
    const isPasswordMatched = await compare(password, foundUser.password);
    if (!isPasswordMatched) {
      return res.status(403).send("Incorrect Password.");
    }
    return res
      .status(201)
      .json({ message: "OK", id: foundUser._id.toString() });
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({ message: "Error", cause: error.message });
  }
};
