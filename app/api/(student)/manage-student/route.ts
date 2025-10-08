import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Student from '@/model/Student';
import User from '@/model/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

// PUT - Update student profile
export async function PUT(request: NextRequest) {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { educationalDetails, interested, skills } = body;

    // Find student profile for current user
    const student = await Student.findOne({ userId: session.user._id });
    if (!student) {
      return NextResponse.json(
        { success: false, error: 'Student profile not found. Please create a student profile first.' },
        { status: 404 }
      );
    }

    // Build update data object with only provided fields
    const updateData: {
      educationalDetails?: string;
      interested?: string[];
      skills?: string[];
    } = {};

    if (educationalDetails !== undefined) updateData.educationalDetails = educationalDetails;
    if (interested !== undefined) updateData.interested = interested;
    if (skills !== undefined) updateData.skills = skills;

    // Update student profile
    const updatedStudent = await Student.findByIdAndUpdate(
      student._id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Student profile updated successfully',
      student: updatedStudent
    });

  } catch (error: unknown) {
    console.error('Error updating student profile:', error);

    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Duplicate data found' },
        { status: 409 }
      );
    }

    if (error && typeof error === 'object' && 'name' in error && error.name === 'ValidationError' && 'message' in error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update student profile' },
      { status: 500 }
    );
  }
}

// DELETE - Delete student profile
export async function DELETE() {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Find and delete student profile
    const student = await Student.findOneAndDelete({ userid: session.user._id });

    if (!student) {
      return NextResponse.json(
        { success: false, message: 'Student profile not found' },
        { status: 404 }
      );
    }

    // Update user's isStudent flag to false
    await User.findByIdAndUpdate(session.user._id, { isStudent: false });

    return NextResponse.json({
      success: true,
      message: 'Student profile deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting student profile:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
