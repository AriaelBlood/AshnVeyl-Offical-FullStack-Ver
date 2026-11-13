import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { login, logout, getMe } from '../controllers/auth.controller.js'

const router = Router()

// Rate limit: 5 login attempts per 15 minutes per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many attempts to break the seal. Please try again after 15 minutes.',
  },
})

router.post('/login', loginLimiter, login)
router.post('/logout', logout)
router.get('/me', getMe)

export default router
