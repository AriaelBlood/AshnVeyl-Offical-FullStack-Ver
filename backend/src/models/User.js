import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      lowercase: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
    },
  },
  {
    timestamps: true,
  },
)

// Instance method to check password validity
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash)
}

// Static helper to hash passwords with salt factor 12
userSchema.statics.hashPassword = async function (plainPassword) {
  const salt = await bcrypt.genSalt(12)
  return bcrypt.hash(plainPassword, salt)
}

export const User = mongoose.model('User', userSchema)
