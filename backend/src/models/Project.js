import mongoose from 'mongoose'

const projectLinksSchema = new mongoose.Schema(
  {
    prototype: { type: String, default: '#' },
    devlog: { type: String, default: null },
  },
  { _id: false },
)

const projectSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, 'Project ID is required'],
      unique: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['games', 'art', 'motion'],
      index: true,
    },
    type: {
      type: String,
      required: [true, 'Type is required'],
      trim: true,
    },
    engine: {
      type: String,
      default: null,
      trim: true,
    },
    status: {
      type: String,
      default: null,
      trim: true,
    },
    live: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    image: {
      type: String,
      default: null,
    },
    links: {
      type: projectLinksSchema,
      default: () => ({ prototype: '#', devlog: null }),
    },
    devlogLabel: {
      type: String,
      default: null,
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  {
    timestamps: true,
  },
)

export const Project = mongoose.model('Project', projectSchema)
