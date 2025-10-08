import mongoose, { Schema, Document } from 'mongoose';

export interface Student extends Document {
  userId: mongoose.Types.ObjectId;
  educationalDetails: {
    collegeName: string;
    degreeName: string;
  }[];
  interested: string[];
  skills: string[];
}

const StudentSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  educationalDetails: {
    type: [{
      collegeName: {
        type: String,
        required: true
      },
      degreeName: {
        type: String,
        required: true
      }
    }], default: []
  },
  interested: [{ type: String, }],
  skills: [{
    type: String
  }],
});


export default mongoose.models.Student || mongoose.model<Student>('Student', StudentSchema);