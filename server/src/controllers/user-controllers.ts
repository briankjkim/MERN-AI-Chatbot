import { compare, hash } from "bcrypt";
import User from "../models/User.js";
import { NextFunction, Request, Response } from "express";
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";

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

    // create and store tokens
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      domain: "localhost",
      signed: true,
      path: "/",
    });

    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    const token = createToken(newUser._id.toString(), newUser.email, "7d"); // Expire token in 7 days
    res.cookie(COOKIE_NAME, token, {
      path: "/",
      domain: "localhost",
      expires: expires,
      httpOnly: true,
      signed: true,
    }); // TODO: Change domain name when deploying

    return res
      .status(201)
      .json({ message: "OK", name: newUser.name, email: newUser.email });
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
    const isPasswordCorrect = await compare(password, foundUser.password);
    if (!isPasswordCorrect) {
      return res.status(403).send("Incorrect Password.");
    }

    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      domain: "localhost",
      signed: true,
      path: "/",
    });

    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    const token = createToken(foundUser._id.toString(), foundUser.email, "7d"); // Expire token in 7 days
    res.cookie(COOKIE_NAME, token, {
      path: "/",
      domain: "localhost",
      expires: expires,
      httpOnly: true,
      signed: true,
    }); // TODO: Change domain name when deploying

    return res
      .status(200)
      .json({ message: "OK", name: foundUser.name, email: foundUser.email });
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({ message: "Error", cause: error.message });
  }
};

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const foundUser = await User.findById(res.locals.jwtData.id);
    if (!foundUser) {
      return res.status(401).send("User not registered or Token is missing.");
    }

    if (foundUser._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match.");
    }

    return res
      .status(200)
      .json({ message: "OK", name: foundUser.name, email: foundUser.email });
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({ message: "Error", cause: error.message });
  }
};

export const userLogout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const foundUser = await User.findById(res.locals.jwtData.id);
    if (!foundUser) {
      return res.status(401).send("User not registered or Token is missing.");
    }

    if (foundUser._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match.");
    }

    // create and store tokens
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      domain: "localhost",
      signed: true,
      path: "/",
    });

    return res
      .status(200)
      .json({ message: "OK", name: foundUser.name, email: foundUser.email });
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({ message: "Error", cause: error.message });
  }
};
