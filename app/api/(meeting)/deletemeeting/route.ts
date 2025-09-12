import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import MeetingModel from "@/model/Meeting";
import mongoose from "mongoose";

export async function DELETE(request: Request) {
    try {
        // Connect to the database
        await dbConnect();

        // Get meeting ID and user ID from the URL params
        const { searchParams } = new URL(request.url);
        const meetingId = searchParams.get('meetingId');
        const userId = searchParams.get('userId');

        // Validate meeting ID
        if (!meetingId || !mongoose.Types.ObjectId.isValid(meetingId)) {
            return NextResponse.json(
                { error: "Valid meeting ID is required" },
                { status: 400 }
            );
        }

        // Validate user ID
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return NextResponse.json(
                { error: "Valid user ID is required" },
                { status: 401 }
            );
        }

        // Find the meeting
        const meeting = await MeetingModel.findById(meetingId);

        if (!meeting) {
            return NextResponse.json(
                { error: "Meeting not found" },
                { status: 404 }
            );
        }

        // Check if the user is authorized to delete this meeting
        if (meeting.createdBy.toString() !== userId) {
            return NextResponse.json(
                { error: "Not authorized to delete this meeting" },
                { status: 403 }
            );
        }

        // Delete the meeting
        await MeetingModel.findByIdAndDelete(meetingId);

        return NextResponse.json({
            message: "Meeting deleted successfully"
        }, { status: 200 });

    } catch (error) {
        console.error('Delete meeting error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Error deleting meeting" },
            { status: 500 }
        );
    }
}