import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/src/lib/database';
import { User } from '@/src/models';
import { Types } from 'mongoose';

export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { userId } = body;

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid user ID',
        },
        { status: 400 }
      );
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          verified: true,
        },
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'User not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'User verified successfully',
        data: user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Verify user error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to verify user',
      },
      { status: 500 }
    );
  }
}
