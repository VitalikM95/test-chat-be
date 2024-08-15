import { Router } from 'express';
import { createChat, sendMessage } from '../controllers/chatController';

const router = Router();

router.post('/', createChat);
router.post('/:chatId/messages', sendMessage);

// Additional routes for updating, deleting, and fetching chats

export default router;
