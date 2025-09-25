import { z } from "zod"

export const userNameValid = z
    .string()
    .min(2, "user name must be at two charactors")
    .max(20, "No more 20 charactors")
    .regex(/^[a-zA-Z0-9_]+$/, "User name must contain no special charactors")

export const signUpSchema = z.object({
    firstName: z.string().min(2, {message: "First name must be at least 2 charactor"}).max(30, {message: "First name must be at most 30 charactor"}),
    lastName: z.string().min(2, {message: "Last name must be at least 2 charactor"}).max(30, {message: "Last name must be at most 30 charactor"}),
    username: userNameValid,
    email: z.string().email({message: "Invalid email"}),
    mobileNmber: z.string().min(10, {message: "Invalid phone number"}).max(15, {message: "Invalid phone number"}),
    password: z.string().min(8, {message: "Charactor atlist 8 charactor minimum"}),
    isMentor: z.boolean({message: "Please select if you are mentor or not"}),
})