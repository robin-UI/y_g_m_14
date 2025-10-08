import { z } from 'zod';
import { userNameValid } from './signUpSchema';


export const userSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    username: userNameValid,
    email: z.string().email("Invalid email address"),
    about: z.string().max(500, "About section cannot exceed 500 characters").optional(),
    mobileNmber: z.string().min(10, "Mobile number must be at least 10 digits").max(15, "Mobile number cannot exceed 15 digits"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    isAcceptingMessages: z.boolean().optional(),
    isProfileViewable: z.boolean().optional(),
    role: z.enum(['STUDENT', 'MENTOR']),
});

export type UserType = z.infer<typeof userSchema>;