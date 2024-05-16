import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import {
  GPT_MODEL,
  MSG_ERR_500,
  MSG_USER_NOT_FOUND,
  ROLE_USER,
} from "../utils/constants.js";
import { configureOpenAI } from "../config/openai-config.js";
import { OpenAIApi, ChatCompletionRequestMessage } from "openai";

export const generateChatCompletion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { message } = req.body;
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) return res.status(401).json({ message: MSG_USER_NOT_FOUND });

    const chats = user.chats.map(({ role, content }) => ({
      role,
      content,
    })) as ChatCompletionRequestMessage[];
    chats.push({ content: message, role: ROLE_USER });
    user.chats.push({ content: message, role: ROLE_USER });

    const config = configureOpenAI();
    const openai = new OpenAIApi(config);
    const chatResponse = await openai.createChatCompletion({
      messages: chats,
      model: GPT_MODEL,
    });
    user.chats.push(chatResponse.data.choices[0].message);
    await user.save();
    return res.status(200).json({ chats: user.chats });
  } catch (error) {
    console.log(
      "Error in server/src/controllers/chat-controllers.ts: generateChatCompletion",
      error
    );
    return res.status(500).json({ message: MSG_ERR_500 });
  }
};
