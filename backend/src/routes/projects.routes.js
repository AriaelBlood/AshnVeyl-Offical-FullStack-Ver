import { Router } from 'express'
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projects.controller.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// Public
router.get('/', getProjects)
router.get('/:id', getProjectById)

// Protected (Admin)
router.post('/', requireAuth, createProject)
router.put('/:id', requireAuth, updateProject)
router.delete('/:id', requireAuth, deleteProject)

export default router
