import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
// import Mentor from '@/model/Mentor';
import User from '@/model/User'

export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    // Build search query
    const searchQuery = search
      ? {
          $or: [
            { username: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { linkedinBio: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    // Get mentors with pagination
    const mentors = await User.find({ ...searchQuery, role: "MENTOR" })
      // .select('firstName lastName username email')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Get total count for pagination
    const totalMentors = await User.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalMentors / limit);

    return NextResponse.json({
      success: true,
      message: 'Mentors retrieved successfully',
      mentors,
      pagination: {
        currentPage: page,
        totalPages,
        totalMentors,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Error retrieving mentors:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}