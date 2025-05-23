import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function PUT(request: Request) {
    try {
        // Connect to the database
        await dbConnect();

        // Get the request body
        const updates = await request.json();
        
        // Extract email from the request body as identifier
        const { email, ...updateData } = updates;
        
        if (!email) {
            return NextResponse.json(
                { error: "Email is required for updating user data" },
                { status: 400 }
            );
        }

        // Validate update data
        const allowedUpdates = ['name', 'password', 'isAcceptingMessages'];
        const updateFields = Object.keys(updateData);
        const isValidOperation = updateFields.every(field => 
            allowedUpdates.includes(field)
        );

        if (!isValidOperation) {
            return NextResponse.json(
                { error: "Invalid updates!" },
                { status: 400 }
            );
        }

        // Find and update the user
        const user = await UserModel.findOneAndUpdate(
            { email: email },
            { $set: updateData },
            { 
                new: true, // Return the updated document
                runValidators: true // Run model validators
            }
        );

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "User updated successfully",
            user: {
                name: user.name,
                email: user.email,
                isAcceptingMessages: user.isAcceptingMessages
            }
        }, { status: 200 });

    } catch (error: any) {
        console.error('Update user error:', error);
        return NextResponse.json(
            { error: error.message || "Error updating user" },
            { status: 500 }
        );
    }
}