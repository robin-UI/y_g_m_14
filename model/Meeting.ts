import mongoose, { Schema, Document } from 'mongoose';

export interface Meeting extends Document {
  subject?: string;
  date: Date;
  time: string;
  duration: number; // duration in minutes
  notes?: string;
  createdBy: mongoose.Schema.Types.ObjectId;
  // attendee: mongoose.Schema.Types.ObjectId;
  status: 'pending' | 'confirmed' | 'cancelled';
  meetingType: "public" | "privet";
  gustName?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MeetingSchema: Schema<Meeting> = new mongoose.Schema({
  subject: {
    type: String,
    // required: [true, 'Meeting subject is required'],
    trim: true,
  },
  date: {
    type: Date,
    required: [true, 'Meeting date is required'],
  },
  time: {
    type: String,
    required: [true, 'Meeting time is required'],
  },
  duration: {
    type: Number,
    // required: [true, 'Meeting duration is required'],
    min: [15, 'Meeting duration must be at least 15 minutes'],
    max: [180, 'Meeting duration cannot exceed 180 minutes'],
  },
  notes: {
    type: String,
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
//   attendee: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending',
  },
  meetingType: {
    type: String,
    enum: ['public', 'privet'],
    default: "public"
  },
  gustName: {
    type: String,
    default: ""
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

const MeetingModel = 
  (mongoose.models.Meeting as mongoose.Model<Meeting>) ||
  mongoose.model<Meeting>('Meeting', MeetingSchema);

export default MeetingModel;