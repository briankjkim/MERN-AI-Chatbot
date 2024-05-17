import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import Configuration, { OpenAI } from "openai";
import { CreateChatCompletionRequestMessage } from "openai/resources/chat/index.mjs";
import { configureOpenAI } from "../config/openai-config.js";
import { SYSTEM_PROMPT_TES } from "../utils/constants.js";

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
    // [{ role: "user", content: message }]

    const params: OpenAI.Chat.CompletionCreateParamsNonStreaming = {
      model: "gpt-3.5-turbo",
      messages: messages,
    };

    // console.log("OpenAI API Request Params:", params);

    const chatCompletion = await openai.chat.completions.create(params);

    // console.log("OpenAI API Response:", chatCompletion);

    if (chatCompletion.choices && chatCompletion.choices.length > 0) {
      const assistantMessage = {
        role: "assistant",
        content: chatCompletion.choices[0].message.content,
      };

      const userMessage = {
        role: "user",
        content: message,
      };

      user.chats.push(userMessage, assistantMessage); // Save both user and assistant messages
      console.log("User chats after adding messages:", user.chats);
      await user.save();

      return res.status(200).json({ chats: user.chats });
    } else {
      console.log("OpenAI response is invalid");
      return res.status(500).json({ message: "OpenAI response is invalid" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
