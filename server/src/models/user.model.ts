import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  birthDate?: Date;
  favoriteCategories?: string[];
  emailPreferences?: {
    newsletter: boolean;
    promotions: boolean;
    productUpdates: boolean;
  };
  phoneNumber?: string;
  bio?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    birthDate: {
      type: Date,
    },
    favoriteCategories: {
      type: [String],
      default: [],
    },
    emailPreferences: {
      newsletter: {
        type: Boolean,
        default: true,
      },
      promotions: {
        type: Boolean,
        default: true,
      },
      productUpdates: {
        type: Boolean,
        default: true,
      },
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot be more than 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', userSchema); 