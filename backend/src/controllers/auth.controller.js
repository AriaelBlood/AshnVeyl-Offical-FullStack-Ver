import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'
import {
  signToken,
  getCookieOptions,
  getJwtSecret,
  COOKIE_NAME,
} from '../middleware/auth.js'

export async function login(req, res) {
  const { username, password } = req.body || {}

  if (!username || !password) {
    return res.status(400).json({
      error: 'Username and password are required to open the vault.',
    })
  }

  const normalizedUser = String(username).toLowerCase().trim()
  const user = await User.findOne({ username: normalizedUser })

  if (!user) {
    return res.status(401).json({
      error: 'Invalid credentials. The vault remains sealed.',
    })
  }

  const isValid = await user.comparePassword(password)
  if (!isValid) {
    return res.status(401).json({
      error: 'Invalid credentials. The vault remains sealed.',
    })
  }

  const token = signToken(user)
  res.cookie(COOKIE_NAME, token, getCookieOptions())

  return res.json({
    user: {
      username: user.username,
    },
    message: 'The seal is broken. Welcome back, hunter.',
  })
}

export function logout(req, res) {
  res.clearCookie(COOKIE_NAME, {
    ...getCookieOptions(),
    maxAge: 0,
  })

  return res.json({
    ok: true,
    message: 'The vault is sealed. Logged out.',
  })
}

export function getMe(req, res) {
  let token = req.cookies?.[COOKIE_NAME]

  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return res.json({ authenticated: false, user: null })
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret())
    return res.json({
      authenticated: true,
      user: {
        username: decoded.username,
      },
    })
  } catch (_err) {
    // Clear corrupted/expired cookie
    res.clearCookie(COOKIE_NAME, getCookieOptions())
    return res.json({ authenticated: false, user: null })
  }
}
