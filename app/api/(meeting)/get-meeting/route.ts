import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import MeetingModel from "@/model/Meeting";
import mongoose from "mongoose";

export async function GET(request: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const meetingId = searchParams.get('meetingId');

        if (!meetingId || !mongoose.Types.ObjectId.isValid(meetingId)) {
            return NextResponse.json(
                { error: "Valid meeting ID is required" },
                { status: 400 }
            );
        }

        const meeting = await MeetingModel.findById(meetingId).exec();

        if (!meeting) {
            return NextResponse.json(
                { error: "Meeting not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Meeting retrieved successfully",
            meeting: {
                _id: meeting._id,
                subject: meeting.subject,
                date: meeting.date,
                time: meeting.time,
                duration: meeting.duration,
                notes: meeting.notes,
                status: meeting.status,
                meetingType: meeting.meetingType,
                createdBy: meeting.createdBy,
                createdAt: meeting.createdAt,
                updatedAt: meeting.updatedAt
            }
        }, { status: 200 });

    } catch (error) {
        console.error('Get meeting error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Error retrieving meeting" },
            { status: 500 }
        );
    }
}
