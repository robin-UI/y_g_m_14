import mongoose, { Schema, Document } from 'mongoose';

export interface User extends Document {
  firstName: string;
  lastName: string;
  email: string;
  mobileNmber: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date; 
  isVerified: boolean;
  isAcceptingMessages: boolean;
}

// Updated User schema
const userSchema: Schema<User> = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/.+\@.+\..+/, 'Please use a valid email address'],
  },
  mobileNmber: {
    type: String,
    trim: true,
    required: [true, 'Mobile Number is required'],
  },
  verifyCode: {
    type: String,
    // required: [true, 'Verify Code is required'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
  },
  verifyCodeExpiry: {
    type: Date,
    // required: [true, 'Verify Code Expiry is required'],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessages: {
    type: Boolean,
    default: true,
  },
});

// const UserModel =
//   (mongoose.models.User as mongoose.Model<User>) ||
//   mongoose.model<User>('User', userSchema);

// export default UserModel;
export default mongoose.models.User || mongoose.model("User", userSchema);
