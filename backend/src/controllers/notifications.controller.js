import { Notification } from '../models/Notification.js'

/**
 * Public: List active notifications (pinned first, newest first)
 */
export async function getNotifications(req, res, next) {
  try {
    const list = await Notification.find()
      .sort({ pinned: -1, createdAt: -1 })
      .select('-__v')
      .lean()

    res.json(list)
  } catch (err) {
    next(err)
  }
}

/**
 * Protected: Create notification
 */
export async function createNotification(req, res, next) {
  try {
    const { title, body, kind, link, pinned } = req.body || {}

    if (!title || !body) {
      return res.status(400).json({ error: 'Title and body are required.' })
    }

    const notification = await Notification.create({
      title,
      body,
      kind: kind || 'info',
      link: link || null,
      pinned: Boolean(pinned),
    })

    res.status(201).json(notification)
  } catch (err) {
    next(err)
  }
}

/**
 * Protected: Delete notification
 */
export async function deleteNotification(req, res, next) {
  try {
    const { id } = req.params
    const deleted = await Notification.findByIdAndDelete(id)

    if (!deleted) {
      return res.status(404).json({ error: 'Notification not found.' })
    }

    res.json({ ok: true, message: 'Notification removed.' })
  } catch (err) {
    next(err)
  }
}
