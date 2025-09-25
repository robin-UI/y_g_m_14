import mongoose, { Schema, Document } from 'mongoose';

export interface Student extends Document {
  userid: string;
  education: string;
  interested: string[];
  skills: string[];
}

const StudentSchema: Schema = new Schema({
  userid: { type: String, required: true },
  education: { type: String, required: true },
  interested: [{ type: String, required: true }],
  skills: [{ type: String, required: true }]
});


export default mongoose.models.Student || mongoose.model<Student>('Student', StudentSchema);