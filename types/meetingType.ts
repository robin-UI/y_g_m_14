import { z } from "zod";

export interface MeetingType {
  _id?: string;
  subject: string;
  date: Date;
  time: string;
  duration: number;
  notes?: string;
  createdBy: string;
  // attendee: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt?: Date;
  updatedAt?: Date;
}

export const meetingFormSchema = z.object({
  subject: z
    .string()
    .min(3, "Subject must be at least 3 characters")
    .max(100, "Subject cannot exceed 100 characters"),
  // date: z.date({
  //   required_error: "Please select a date",
  // }),
  date: z.preprocess(
    (arg) => {
      if (typeof arg === "string") {
        return new Date(arg);
      }
      return arg;
    },
    z.date({
      required_error: "Please select a date",
    })
  ),
  time: z.string({
    required_error: "Please select a time",
  }),
  duration: z
    .number()
    .min(15, "Duration must be at least 15 minutes")
    .max(180, "Duration cannot exceed 180 minutes"),
  notes: z.string().optional(),
  userId: z.string({
    required_error: "User ID is required",
  }),
  // attendeeId: z.string({
  //   required_error: "Please select an attendee",
  // }),
});

export type MeetingFormData = z.infer<typeof meetingFormSchema>;
