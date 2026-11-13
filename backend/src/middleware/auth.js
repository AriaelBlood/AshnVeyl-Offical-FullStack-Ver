import jwt from 'jsonwebtoken'

const COOKIE_NAME = 'vault_token'

export function getJwtSecret() {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET must be configured in production')
    }
    return 'vault_dev_fallback_secret_key_32chars_min'
  }
  return secret
}

export function signToken(user) {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    getJwtSecret(),
    { expiresIn: '7d' },
  )
}

export function getCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production'
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  }
}

/**
 * Middleware: Strictly requires valid admin JWT.
 * Reads from httpOnly cookie 'vault_token', with Authorization header fallback.
 */
export function requireAuth(req, res, next) {
  let token = req.cookies?.[COOKIE_NAME]

  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return res.status(401).json({
      error: 'Authentication required. The vault remains sealed.',
    })
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret())
    req.user = decoded
    next()
  } catch (_err) {
    return res.status(401).json({
      error: 'Invalid or expired seal token.',
    })
  }
}

/**
 * Middleware: Optional authentication.
 * If token is present and valid, attaches req.user.
 * If not, proceeds without error (useful for draft previews).
 */
export function optionalAuth(req, _res, next) {
  let token = req.cookies?.[COOKIE_NAME]

  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, getJwtSecret())
      req.user = decoded
    } catch (_err) {
      // Ignore invalid token on optional routes
    }
  }

  next()
}

export { COOKIE_NAME }
