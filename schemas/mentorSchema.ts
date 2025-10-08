import { z } from "zod"

export const mentorSchema = z.object({
    // userId: z.string(),
    socialLinks: z.array(z.string()).optional(),
    isMentorVerified: z.boolean().optional(),
    educationalDetails: z.array(z.object({
        collegeName: z.string({message: "College name is required"}),
        degreeName: z.string({message: "Degree also is required"}),
    })).optional(),
    workExperience: z.array(z.object({
        companyName: z.string({message: "Company name is required"}),
        role: z.string({message: "Role is required"}),
        experience: z.string({message: "Experience is required"}),
    })).optional(),
    price: z.number().optional(),
    skills: z.array(z.string()).optional(), //React js, Node js, MongoDB
    fields: z.array(z.string()).optional(), //Web Development, Mobile Development
    Rating: z.number().optional(),
    Reviews: z.array(z.string()).optional(),
    location: z.string().optional(),
    availability: z.string().optional(),
});

export type MentorType = z.infer<typeof mentorSchema>;