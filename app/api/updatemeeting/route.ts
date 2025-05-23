import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import MeetingModel from "@/model/Meeting";
import UserModel from "@/model/User";
import { meetingFormSchema } from "@/types/meetingType";
import mongoose from "mongoose";

export async function PUT(request: Request) {
    try {
        // Connect to the database
        await dbConnect();

        // Get the request body
        const body = await request.json();
        
        // Get meeting ID and user ID
        const { meetingId, userId, ...updateData } = body;

        if (!meetingId || !mongoose.Types.ObjectId.isValid(meetingId)) {
            return NextResponse.json(
                { error: "Valid meeting ID is required" },
                { status: 400 }
            );
        }

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return NextResponse.json(
                { error: "Valid user ID is required" },
                { status: 401 }
            );
        }

        // Find the existing meeting
        const existingMeeting = await MeetingModel.findById(meetingId);
        
        if (!existingMeeting) {
            return NextResponse.json(
                { error: "Meeting not found" },
                { status: 404 }
            );
        }

        // Check if the user is authorized to update this meeting
        if (existingMeeting.createdBy.toString() !== userId) {
            return NextResponse.json(
                { error: "Not authorized to update this meeting" },
                { status: 403 }
            );
        }

        // Validate the update data
        try {
            // Only validate the fields that are being updated
            const partialSchema = meetingFormSchema.partial();
            partialSchema.parse(updateData);
        } catch (error) {
            return NextResponse.json(
                { error: "Invalid meeting data", details: error },
                { status: 400 }
            );
        }

        // Only allow updating specific fields
        const allowedUpdates = {
            subject: updateData.subject,
            date: updateData.date,
            time: updateData.time,
            duration: updateData.duration,
            notes: updateData.notes,
            status: updateData.status,
            attendeeId: updateData.attendeeId
        };

        // Remove undefined values
        Object.keys(allowedUpdates).forEach(key => 
            allowedUpdates[key] === undefined && delete allowedUpdates[key]
        );

        // If attendeeId is being updated, verify the new attendee exists
        if (allowedUpdates.attendeeId) {
            const attendeeExists = await UserModel.findById(allowedUpdates.attendeeId);
            if (!attendeeExists) {
                return NextResponse.json(
                    { error: "Invalid attendee ID" },
                    { status: 400 }
                );
            }
            // Update the attendee field name to match the schema
            allowedUpdates.attendee = allowedUpdates.attendeeId;
            delete allowedUpdates.attendeeId;
        }

        // Update the meeting
        const updatedMeeting = await MeetingModel.findByIdAndUpdate(
            meetingId,
            { $set: allowedUpdates },
            { 
                new: true, // Return the updated document
                runValidators: true // Run model validators
            }
        ).populate('createdBy', 'name email')
         .populate('attendee', 'name email');

        if (!updatedMeeting) {
            return NextResponse.json(
                { error: "Meeting could not be updated" },
                { status: 400 }
            );
        }

        // Return the updated meeting
        return NextResponse.json({
            message: "Meeting updated successfully",
            meeting: {
                _id: updatedMeeting._id,
                subject: updatedMeeting.subject,
                date: updatedMeeting.date,
                time: updatedMeeting.time,
                duration: updatedMeeting.duration,
                notes: updatedMeeting.notes,
                status: updatedMeeting.status,
                // createdBy: {
                //     _id: updatedMeeting.createdBy._id,
                //     name: updatedMeeting.createdBy.name,
                //     email: updatedMeeting.createdBy.email
                // },
                // attendee: {
                //     _id: updatedMeeting.attendee._id,
                //     name: updatedMeeting.attendee.name,
                //     email: updatedMeeting.attendee.email
                // },
                createdAt: updatedMeeting.createdAt,
                updatedAt: updatedMeeting.updatedAt
            }
        }, { status: 200 });

    } catch (error) {
        console.error('Update meeting error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Error updating meeting" },
            { status: 500 }
        );
    }
}