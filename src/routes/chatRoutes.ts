import { Router } from 'express'
import {
  createChat,
  getChats,
  getChatById,
  updateChat,
  deleteChat,
  sendMessage,
} from '../controllers/chatController'

const router = Router()

router.get('/', getChats)
router.get('/:id', getChatById)
router.post('/', createChat)
router.put('/:id', updateChat)
router.delete('/:id', deleteChat)
router.post('/:id/messages', sendMessage)

export default router
