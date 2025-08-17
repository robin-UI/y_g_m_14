import mongoose, { Schema, Document } from 'mongoose';

export interface User extends Document {
  name: string;
  email: string;
  // mobileNmber: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date; 
  isVerified: boolean;
  isAcceptingMessages: boolean;
}

// Updated User schema
const userSchema: Schema<User> = new mongoose.Schema({
  name: {
    type: String,
    // required: [true, 'Username is required'],
    trim: true,
    // unique: true,    
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/.+\@.+\..+/, 'Please use a valid email address'],
  },
  verifyCode: {
    type: String,
    // required: [true, 'Verify Code is required'],
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
