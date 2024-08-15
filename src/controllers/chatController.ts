import { Request, Response } from 'express';
import { Chat } from '../models/chat';
import { Message } from '../models/message';
import { getRandomQuote } from '../services/quoteService';

export const createChat = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName } = req.body;
    const newChat = new Chat({ firstName, lastName, messages: [] });
    await newChat.save();
    res.status(201).json(newChat);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create chat' });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;
    const { content } = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    const userMessage = new Message({ content, sender: 'user' });
    await userMessage.save();

    chat.messages.push(userMessage);
    await chat.save();

    setTimeout(async () => {
      const botReply = await getRandomQuote();
      const botMessage = new Message({ content: botReply, sender: 'bot' });
      await botMessage.save();

      chat.messages.push(botMessage);
      await chat.save();

      res.status(201).json({ userMessage, botMessage });
    }, 3000);

  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
};
