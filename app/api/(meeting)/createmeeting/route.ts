import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import MeetingModel from "@/model/Meeting";
import UserModel from "@/model/User";
import { meetingFormSchema } from "@/types/meetingType";

export async function POST(request: Request) {
  try {
    // Connect to the database
    await dbConnect();    // Get the request body and validate auth
    const body = await request.json();
    const createdBy = body.userId;

    if (!createdBy) {
        return NextResponse.json(
            { error: "Authentication required. Please provide user ID" },
            { status: 401 }
        );
    }

    // Validate the meeting data using Zod schema
    try {
      meetingFormSchema.parse(body);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid meeting data", details: error },
        { status: 400 }
      );
    }

    // Check if both users exist
    // const [creator, attendee] = await Promise.all([
    //   UserModel.findById(createdBy),
    //   UserModel.findById(body.attendeeId),
    // ]);

    const creator = await UserModel.findById(createdBy)

    if (!creator) {
      return NextResponse.json(
        { error: "Invalid user ID(s)" },
        { status: 404 }
      );
    }

    // Create the meeting
    const meeting = await MeetingModel.create({
      subject: body.subject,
      date: body.date,
      time: body.time,
      duration: body.duration,
      notes: body.notes,
      createdBy: createdBy,
    //   attendee: body.attendeeId,
      status: "pending",
    });    // Populate the creator and attendee information
    const populatedMeeting = await MeetingModel.findById(meeting._id)
      .populate('createdBy', 'name email');
    //   .populate('attendee', 'name email')

    console.log("Meeting created:", populatedMeeting);
    

    // Return the created meeting with user details
    return NextResponse.json(
      {
        message: "Meeting created successfully",
        meeting: {
          _id: meeting._id,
          subject: meeting.subject,
          date: meeting.date,
          time: meeting.time,
          duration: meeting.duration,
          notes: meeting.notes,
          status: meeting.status,
        //   createdBy: {
        //     _id: populatedMeeting.createdBy._id,
        //     name: populatedMeeting.createdBy.name,
        //     email: populatedMeeting.createdBy.email
        //   },
        //   attendee: {
        //     _id: populatedMeeting.attendee._id,
        //     name: populatedMeeting.attendee.name,
        //     email: populatedMeeting.attendee.email
        //   },
          createdAt: meeting.createdAt
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create meeting error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Error creating meeting",
      },
      { status: 500 }
    );
  }
}
