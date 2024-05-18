import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import { OpenAI } from "openai";
import { CreateChatCompletionRequestMessage } from "openai/resources/chat/index.mjs";
import { configureOpenAI } from "../config/openai-config.js";
import { ROLE_USER, SYSTEM_PROMPT_TES } from "../utils/constants.js";

export const generateChatCompletion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { message } = req.body;
    // Add validation check
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User not registered OR Token malfunctioned" });
    }
    // Set up OpenAI object with configuration
    const config = configureOpenAI();
    const openai = new OpenAI({ apiKey: config.apiKey });
    const messages = [
      {
        role: "system",
        content: SYSTEM_PROMPT_TES,
      },
      ...user.chats.map(({ role, content }) => ({ role, content })),
      { role: "user", content: message },
    ] as CreateChatCompletionRequestMessage[];
    // console.log("Constructed messages:", messages);

    const params: OpenAI.Chat.CompletionCreateParamsNonStreaming = {
      model: "gpt-3.5-turbo",
      messages: messages,
    };
    // console.log("OpenAI API Request Params:", params);

    const chatCompletion = await openai.chat.completions.create(params);
    // console.log("OpenAI API Response:", chatCompletion);

    // reference: https://platform.openai.com/docs/api-reference/chat/create
    if (chatCompletion.choices && chatCompletion.choices.length > 0) {
      const assistantMessage = {
        role: chatCompletion.choices[0].message.role,
        content: chatCompletion.choices[0].message.content,
      };

      const userMessage = {
        role: ROLE_USER,
        content: message,
      };

      user.chats.push(userMessage, assistantMessage); // Save both user and assistant messages
      // console.log("User chats after adding messages:", user.chats);
      await user.save();

      return res.status(200).json({ chats: user.chats });
    } else {
      console.log("OpenAI response is invalid");
      return res.status(500).json({ message: "OpenAI response is invalid" });
    }
  } catch (error) {
    console.error(
      "Error - generateChatCompletion server.src.controllers.chat-controllers: ",
      error
    );
    return res.status(500).json({
      message: "Internal Server Error: Contact Server for Error Messages.",
    });
  }
};

export const sendChatsToUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // user token check
    const foundUser = await User.findById(res.locals.jwtData.id);
    if (!foundUser) {
      return res.status(401).send("User not registered or Token is missing.");
    }

    if (foundUser._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match.");
    }

    return res.status(200).json({ message: "OK", chats: foundUser.chats });
  } catch (error) {
    console.log(
      "Error - sendChatstoUser server.src.controllers.chat-controllers: ",
      error
    );
    return res.status(500).json({ message: "Error", cause: error.message });
  }
};

export const deleteChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // user token check
    const foundUser = await User.findById(res.locals.jwtData.id);
    if (!foundUser) {
      return res.status(401).send("User not registered or Token is missing.");
    }

    if (foundUser._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match.");
    }
    //@ts-ignore
    foundUser.chats = [];
    await foundUser.save();
    return res.status(200).json({ message: "OK" });
  } catch (error) {
    console.log(
      "Error - sendChatstoUser server.src.controllers.chat-controllers: ",
      error
    );
    return res.status(500).json({ message: "Error", cause: error.message });
  }
};
