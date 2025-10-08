import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import MeetingModel from "@/model/Meeting";
import UserModel from "@/model/User";
import { meetingFormSchema } from "@/types/meetingType";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function POST(request: Request) {
  try {
    // Connect to the database
    await dbConnect();

    // Get session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Get the request body
    const body = await request.json();
    const createdBy = session.user._id;

    // Validate the meeting data using Zod schema
    try {
      meetingFormSchema.parse(body);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "Invalid meeting data", details: error },
        { status: 400 }
      );
    }

    // Verify user exists
    const creator = await UserModel.findById(createdBy);
    if (!creator) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Create the meeting
    const meeting = await MeetingModel.create({
      subject: body.subject,
      date: body.date,
      time: body.time,
      duration: body.duration,
      notes: body.notes || "",
      createdBy: createdBy,
      status: "pending",
      meetingType: body.meetingType || "public",
    });

    // Populate the creator information
    const populatedMeeting = await MeetingModel.findById(meeting._id)
      .populate('createdBy', 'firstName lastName username email');

    return NextResponse.json(
      {
        success: true,
        message: "Meeting created successfully",
        meeting: populatedMeeting,
        room_id: meeting._id
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create meeting error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Error creating meeting",
      },
      { status: 500 }
    );
  }
}
