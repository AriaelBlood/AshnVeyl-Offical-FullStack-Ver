import { Router } from 'express'
import {
  getNotifications,
  createNotification,
  deleteNotification,
} from '../controllers/notifications.controller.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// Public
router.get('/', getNotifications)

// Protected (Admin)
router.post('/', requireAuth, createNotification)
router.delete('/:id', requireAuth, deleteNotification)

export default router
