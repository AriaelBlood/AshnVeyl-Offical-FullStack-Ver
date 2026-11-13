import mongoose from 'mongoose'

const devlogBlockSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['paragraph', 'heading', 'divider', 'image', 'code', 'callout'],
    },
    lead: { type: Boolean, default: false },
    text: { type: String, default: '' },
    label: { type: String, default: '' },
    src: { type: String, default: '' },
    alt: { type: String, default: '' },
    caption: { type: String, default: '' },
    file: { type: String, default: '' },
    lang: { type: String, default: 'gdscript' },
    code: { type: String, default: '' },
    title: { type: String, default: '' },
  },
  { _id: false },
)

const devlogSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    number: {
      type: Number,
      required: [true, 'Devlog number is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Display date is required'],
      trim: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    readTime: {
      type: String,
      default: '5 MIN READ',
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    summary: {
      type: String,
      required: [true, 'Summary is required'],
      trim: true,
    },
    image: {
      type: String,
      default: null,
    },
    published: {
      type: Boolean,
      default: false,
      index: true,
    },
    blocks: {
      type: [devlogBlockSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
)

export const Devlog = mongoose.model('Devlog', devlogSchema)
