import { Router } from 'express'
import {
  getPublishedDevlogs,
  getDevlogBySlug,
  getAllDevlogsAdmin,
  createDevlog,
  updateDevlog,
  deleteDevlog,
} from '../controllers/devlogs.controller.js'
import { requireAuth, optionalAuth } from '../middleware/auth.js'

const router = Router()

// Public
router.get('/', getPublishedDevlogs)
router.get('/:slug', optionalAuth, getDevlogBySlug)

// Protected (Admin)
router.get('/admin/all', requireAuth, getAllDevlogsAdmin)
router.post('/', requireAuth, createDevlog)
router.put('/:id', requireAuth, updateDevlog)
router.delete('/:id', requireAuth, deleteDevlog)

export default router
