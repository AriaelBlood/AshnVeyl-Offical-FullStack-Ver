import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    body: {
      type: String,
      required: [true, 'Body is required'],
      trim: true,
    },
    kind: {
      type: String,
      enum: ['info', 'milestone', 'release'],
      default: 'info',
    },
    link: {
      type: String,
      default: null,
      trim: true,
    },
    pinned: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  },
)

export const Notification = mongoose.model('Notification', notificationSchema)
