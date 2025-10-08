import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import StudentModel from "@/model/Student";
import MentorModel from "@/model/Mentor";

export async function GET(request: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');
        const username = searchParams.get('username');

        if (!email && !username) {
            return NextResponse.json(
                { success: false, message: "Email or username is required" },
                { status: 400 }
            );
        }

        const query = email ? { email } : { username };
        const user = await UserModel.findOne(query).select('-password -verifyCode');

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        if (user?.role === 'MENTOR') {
            const mentorDetails = await MentorModel.findOne({ userId: user._id });
            if (!mentorDetails) {
                return NextResponse.json(
                    { success: false, message: "Mentor details not found" },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                success: true,
                data: { ...user.toObject(), details: mentorDetails.toObject() }
            }, { status: 200 });
        }

        if (user?.role === 'STUDENT') {
            const studentDetails = await StudentModel.findOne({ userId: user._id });
            if (!studentDetails) {
                return NextResponse.json(
                    { success: false, message: "Student details not found" },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                success: true,
                data: { ...user.toObject(), details: studentDetails.toObject() }
            }, { status: 200 });
        }


        if (!user.isProfileViewable) {
            return NextResponse.json({
                success: false,
                message: "The account is privet you can see the profile"
            }, { status: 400 })
        }

    } catch (error: unknown) {
        console.error('Get user profile error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Error fetching user profile" },
            { status: 500 }
        );
    }
}