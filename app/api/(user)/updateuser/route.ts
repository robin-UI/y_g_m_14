import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
// import bcrypt from "bcryptjs";
import { UserType } from "@/schemas/userSchema";

export async function PUT(request: NextRequest) {
    await dbConnect();

    try {
        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json(
                { success: false, error: "Not authenticated" },
                { status: 401 }
            );
        }

        // Get the request body
        const body = await request.json();
        const {
            firstName,
            lastName,
            username,
            about,
            mobileNmber,
            isAcceptingMessages,
            isProfileViewable,
        } = body;

        console.log("Request Body:", body);

        // Find the current user
        const user = await UserModel.findById(session.user._id);
        if (!user) {
            return NextResponse.json(
                { success: false, error: "User not found" },
                { status: 404 }
            );
        }

        // Build update data object
        const updateData: Partial<UserType> = {};

        if (firstName !== undefined && firstName !== null) updateData.firstName = firstName;
        if (lastName !== undefined && lastName !== null) updateData.lastName = lastName;
        if (about !== undefined && about !== null) updateData.about = about;
        if (mobileNmber !== undefined && mobileNmber !== null) updateData.mobileNmber = mobileNmber;
        if (isAcceptingMessages !== undefined) updateData.isAcceptingMessages = isAcceptingMessages;
        if (isProfileViewable !== undefined) updateData.isProfileViewable = isProfileViewable;

        // Handle username update with uniqueness check
        if (username !== undefined && username !== user.username) {
            const existingUser = await UserModel.findOne({ username });
            if (existingUser) {
                return NextResponse.json(
                    { success: false, error: "Username already taken" },
                    { status: 409 }
                );
            }
            updateData.username = username;
        }

        // Handle password update with hashing
        // if (password !== undefined && password.trim() !== "") {
        //     const hashedPassword = await bcrypt.hash(password, 10);
        //     updateData.password = hashedPassword;
        // }

        console.log("Update Data:", updateData);

        // Update the user
        const updatedUser = await UserModel.findByIdAndUpdate(
            session.user._id,
            { $set: updateData },
            {
                new: true,
                runValidators: true,
            }
        ).select("-password -verifyCode -verifyCodeExpiry");

        console.log("Updated User:", updatedUser);

        return NextResponse.json(
            {
                success: true,
                message: "User updated successfully",
                user: updatedUser,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Update user error:", error);

        // Handle duplicate key error
        if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
            return NextResponse.json(
                { success: false, error: "Username or email already exists" },
                { status: 409 }
            );
        }

        // Handle validation error
        if (error && typeof error === 'object' && 'name' in error && error.name === 'ValidationError') {
            const validationError = error as { name: string; message: string };
            return NextResponse.json(
                { success: false, error: validationError.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, error: "Failed to update user" },
            { status: 500 }
        );
    }
}
