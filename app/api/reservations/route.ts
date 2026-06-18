import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/src/lib/database';
import { Reservation, Donation, User } from '@/src/models';
import { DonationStatus } from '@/src/types';
import { auth } from '@/src/lib/next-auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');

    let query: any = {};

    if (userId) {
      query.receiverId = userId;
    }

    if (status) {
      query.status = status;
    }

    const reservations = await Reservation.find(query)
      .populate('donationId', 'title quantity unit expiryDate')
      .populate('donorId', 'name email profileImage')
      .populate('receiverId', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Reservation.countDocuments(query);

    return NextResponse.json(
      {
        success: true,
        data: reservations,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get reservations error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch reservations',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Check authentication (v5: auth() instead of getServerSession)
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized: Please login first',
        },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (session.user?.role !== 'admin') {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized: Only admin users can reserve food',
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { donationId, receiverId, quantity, pickupDate } = body;

    if (!donationId || !receiverId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields: donationId and receiverId',
        },
        { status: 400 }
      );
    }

    // Verify donation exists and is available
    const donation = await Donation.findById(donationId);
    if (!donation) {
      return NextResponse.json(
        {
          success: false,
          message: 'Donation not found',
        },
        { status: 404 }
      );
    }

    if (donation.status !== DonationStatus.AVAILABLE) {
      return NextResponse.json(
        {
          success: false,
          message: 'Donation is not available',
        },
        { status: 400 }
      );
    }

    // Verify receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return NextResponse.json(
        {
          success: false,
          message: 'Receiver not found',
        },
        { status: 404 }
      );
    }

    const reservation = await Reservation.create({
      donationId,
      receiverId,
      status: 'pending',
      pickupDate: pickupDate || null,
      notes: '',
    });

    // Update donation status
    await Donation.findByIdAndUpdate(donationId, {
      $set: { status: DonationStatus.RESERVED },
      $push: { reservations: reservation._id },
    });

    // Update receiver's totalReservations
    await User.findByIdAndUpdate(receiverId, {
      $inc: { totalReservations: 1 },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Reservation created successfully',
        data: reservation,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create reservation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      {
        success: false,
        message: errorMessage || 'Failed to create reservation',
      },
      { status: 500 }
    );
  }
}