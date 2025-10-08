import mongoose, { Schema, Document } from 'mongoose';

export interface Mentor extends Document {
    userId: mongoose.Types.ObjectId;
    socialLinks: string[];
    isMentorVerified?: boolean;
    educationalDetails: {
        collegeName: string;
        degreeName: string;
    }[];
    workExperience: {
        companyName: string;
        role: string;
        experience: string;
    }[];
    price?: number;
    skills?: string[]; //React js, Node js, MongoDB
    fields?: string[]; //Web Development, Mobile Development
    Rating?: number;
    Reviews?: string[];
    location?: string;
    availability?: string;
    // createdAt: Date;
}

const MentorSchema: Schema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    linkedinBio: {
        type: String,
        // required: true
    },
    isMentorVerified: {
        type: Boolean,
        default: false
    },
    educationalDetails: [{
        collegeName: {
            type: String,
            // required: true
        },
        degreeName: {
            type: String,
            // required: true
        }
    }],
    workExperience: [{
        companyName: {
            type: String,
            // required: true
        },
        role: {
            type: String,
            // required: true
        },
        experience: {
            type: String,
            // required: true
        }
    }],
    skills: [{
        type: String
    }],
    fields: [{
        type: String
    }],
    Specializations: [{
        type: String
    }],
    price: {
        type: Number
    },
    Rating: {
        type: Number,
        default: 0
    },
    Reviews: [{
        type: String
    }],
    location: {
        type: String        
    },
    availability: {
        type: String
    }
}, {
    timestamps: true
});

export default mongoose.models.Mentor || mongoose.model<Mentor>('Mentor', MentorSchema);