import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Mentor from '@/model/Mentor';
import User from '@/model/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

// GET - Retrieve mentor profile
export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const mentorId = searchParams.get('mentorId');
    const userId = searchParams.get('userId');

    let mentor;

    if (mentorId) {
      // Get mentor by mentor ID
      mentor = await Mentor.findById(mentorId).populate('userId', 'firstName lastName username email');
    } else if (userId) {
      // Get mentor by user ID
      mentor = await Mentor.findOne({ userId }).populate('userId', 'firstName lastName username email');
    } else {
      // Get current user's mentor profile
      mentor = await Mentor.findOne({ userId: session.user._id }).populate('userId', 'firstName lastName username email');
    }

    if (!mentor) {
      return NextResponse.json(
        { success: false, message: 'Mentor profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Mentor profile retrieved successfully',
      mentor
    });

  } catch (error) {
    console.error('Error retrieving mentor profile:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new mentor profile
export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { name, email, linkedinBio, educationalDetails, workExperience } = await request.json();

    // Validate required fields
    if (!name || !email || !linkedinBio) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and LinkedIn bio are required' },
        { status: 400 }
      );
    }

    // Check if mentor profile already exists for this user
    const existingMentor = await Mentor.findOne({ userId: session.user._id });
    if (existingMentor) {
      return NextResponse.json(
        { success: false, message: 'Mentor profile already exists for this user' },
        { status: 409 }
      );
    }

    // Verify user exists and update isMentor flag
    const user = await User.findById(session.user._id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Create new mentor profile
    const newMentor = new Mentor({
      userId: session.user._id,
      name,
      email,
      linkedinBio,
      educationalDetails: educationalDetails || [],
      workExperience: workExperience || []
    });

    await newMentor.save();

    // Update user's isMentor flag
    await User.findByIdAndUpdate(session.user._id, { isMentor: true });

    const populatedMentor = await Mentor.findById(newMentor._id).populate('userId', 'firstName lastName username email');

    return NextResponse.json({
      success: true,
      message: 'Mentor profile created successfully',
      mentor: populatedMentor
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating mentor profile:', error);

    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'Mentor profile already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update mentor profile
export async function PUT(request: NextRequest) {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { name, email, linkedinBio, educationalDetails, workExperience } = await request.json();

    // Find mentor profile for current user
    const mentor = await Mentor.findOne({ userId: session.user._id });
    if (!mentor) {
      return NextResponse.json(
        { success: false, message: 'Mentor profile not found' },
        { status: 404 }
      );
    }

    interface educationalDetails {
      collegeName: string;
      degreeName: string;
    }

    interface workExperience {
      companyName: string;
      role: string;
      experience: string;
    }

    interface MentorUpdateData {
      name?: string;
      email?: string;
      linkedinBio?: string;
      educationalDetails?: educationalDetails[];
      workExperience?: workExperience[];
    }

    // Update mentor profile
    const updateData: MentorUpdateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (linkedinBio !== undefined) updateData.linkedinBio = linkedinBio;
    if (educationalDetails !== undefined) updateData.educationalDetails = educationalDetails;
    if (workExperience !== undefined) updateData.workExperience = workExperience;

    const updatedMentor = await Mentor.findByIdAndUpdate(
      mentor._id,
      updateData,
      { new: true, runValidators: true }
    ).populate('userId', 'firstName lastName username email');

    return NextResponse.json({
      success: true,
      message: 'Mentor profile updated successfully',
      mentor: updatedMentor
    });

  } catch (error) {
    console.error('Error updating mentor profile:', error);

    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'Email already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}