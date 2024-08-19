import { Request, Response, NextFunction } from 'express'
import { Chat } from '../models/chatModel'
import { Message } from '../models/messageModel'
import { AppError } from '../utils/errorClass'

export const createChat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName } = req.body
    if (!firstName || !lastName) {
      throw new AppError('First name and last name are required', 400)
    }

    const newChat = new Chat({ firstName, lastName, messages: [] })
    await newChat.save()
    res.status(201).json(newChat)
  } catch (err) {
    next(new AppError('Failed to create chat', 400))
  }
}

export const getChats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const chats = await Chat.find().populate('messages')
    res.status(200).json(chats)
  } catch (err) {
    next(new AppError('Failed to retrieve chats', 500))
  }
}

export const getChatById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const chat = await Chat.findById(req.params.id).populate('messages')
    if (!chat) {
      throw new AppError('Chat not found', 404)
    }
    res.status(200).json(chat)
  } catch (err) {
    next(new AppError('Failed to retrieve chat', 500))
  }
}

export const updateChat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedChat = await Chat.findByIdAndUpdate(req.params.id, {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    })
    if (!updatedChat) {
      throw new AppError('Chat not found', 404)
    }
    res.status(200).json(updatedChat)
  } catch (err) {
    next(new AppError('Failed to update chat', 400))
  }
}

export const deleteChat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const chat = await Chat.findById(req.params.id)
    if (!chat) {
      throw new AppError('Chat not found', 404)
    }
    await Message.deleteMany({ _id: { $in: chat.messages } })
    await Chat.deleteOne({ _id: req.params.id })
    res.status(200).json({ message: 'Chat deleted successfully' })
  } catch (err) {
    next(new AppError('Failed to delete chat', 500))
  }
}

export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { text } = req.body

    if (!text) {
      throw new AppError('Message text is required', 400)
    }

    const chat = await Chat.findById(req.params.id)
    if (!chat) {
      throw new AppError('Chat not found', 404)
    }

    const newMessage = new Message({
      content: text,
      sender: 'user',
    })

    const savedMessage = (await newMessage.save()) as any

    chat.messages.push(savedMessage._id)
    await chat.save()

    res.status(201).json(savedMessage)

    // // Логіка для авто-відповіді через 3 секунди
    // setTimeout(async () => {
    //   try {
    //     // Створення авто-відповіді
    //     const autoReplyMessage = new Message({
    //       content: 'This is an automated response',
    //       sender: 'bot', // Відповідь від бота
    //     });

    //     // Збереження авто-відповіді
    //     await autoReplyMessage.save();

    //     // Додавання авто-відповіді до чату
    //     chat.messages.push(autoReplyMessage._id);
    //     await chat.save();

    //     // Можливо, тут слід відправити повідомлення клієнту через WebSocket або інший метод
    //     // для оновлення чату в реальному часі

    //   } catch (err) {
    //     console.error('Failed to send auto-response:', err);
    //     // Можна обробити помилку авто-відповіді, якщо потрібно
    //   }
    // }, 3000); // Затримка 3 секунди
    // // logic to send auto-response after 3 seconds
  } catch (err) {
    next(new AppError('Failed to send message', 400))
  }
}
