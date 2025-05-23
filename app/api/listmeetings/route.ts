import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
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
            $or: { createdBy: string; }[] | { attendee: string; }[];
            status?: string;
        } = {
            $or: [
                { createdBy: userId },
                // { attendee: userId }
            ]
        };

        // Add status filter if valid status provided
        if (status && validStatuses.includes(status)) {
            conditions.status = status;
        }

        // Get meetings where user is either creator or attendee
        const meetings = await MeetingModel.find(conditions)
            .populate('createdBy', 'name email')
            .populate('attendee', 'name email')
            .sort({ date: 1, time: 1 }) // Sort by date and time ascending
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
            // createdBy: {
            //     _id: meeting.createdBy._id,
            //     name: meeting.createdBy.name,
            //     email: meeting.createdBy.email
            // },
            // attendee: {
            //     _id: meeting.attendee._id,
            //     name: meeting.attendee.name,
            //     email: meeting.attendee.email
            // },
            // isCreator: meeting.createdBy._id.toString() === userId,
            createdAt: meeting.createdAt,
            updatedAt: meeting.updatedAt
        }));

        // Group meetings by date
        const groupedMeetings = transformedMeetings
        // .reduce((groups, meeting) => {
        //     const date = new Date(meeting.date).toISOString().split('T')[0];
        //     if (!groups[date]) {
        //         groups[date] = [];
        //     }
        //     groups[date].push(meeting);
        //     return groups;
        // }, {});

        return NextResponse.json({
            message: "Meetings retrieved successfully",
            meetings: groupedMeetings
        }, { status: 200 });

    } catch (error) {
        console.error('List meetings error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Error retrieving meetings" },
            { status: 500 }
        );
    }
}