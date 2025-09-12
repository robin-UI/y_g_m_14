import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
// import UserModel from "@/model/User"; // ✅ Uncomment this import
import MeetingModel from "@/model/Meeting";
import mongoose from "mongoose";

export async function GET(request: Request) {
    try {
        // Connect to the database
        await dbConnect();

        // Get user ID from the URL params
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return NextResponse.json(
                { error: "Valid user ID is required" },
                { status: 400 }
            );
        }

        // Get status filter if provided
        const status = searchParams.get('status');
        const validStatuses = ['pending', 'confirmed', 'cancelled'];

        // Build query conditions
        const conditions: {
            $or: { createdBy: string; }[];
            status?: string;
        } = {
            $or: [
                { createdBy: userId },
            ]
        };

        // Add status filter if valid status provided
        if (status && validStatuses.includes(status)) {
            conditions.status = status;
        }

        // Get meetings where user is either creator or attendee
        const meetings = await MeetingModel.find(conditions)
            .sort({ date: 1, time: 1 })
            .exec();

        // Transform meetings for response
        const transformedMeetings = meetings.map(meeting => ({
            _id: meeting._id,
            subject: meeting.subject,
            date: meeting.date,
            time: meeting.time,
            duration: meeting.duration,
            notes: meeting.notes,
            status: meeting.status,
            createdBy: meeting.createdBy, // Include populated user data
            createdAt: meeting.createdAt,
            updatedAt: meeting.updatedAt
        }));

        return NextResponse.json({
            message: "Meetings retrieved successfully",
            meetings: transformedMeetings
        }, { status: 200 });

    } catch (error) {
        console.error('List meetings error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Error retrieving meetings" },
            { status: 500 }
        );
    }
}