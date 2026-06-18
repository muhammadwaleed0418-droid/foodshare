import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/src/lib/database';
import { Donation } from '@/src/models';
import { Types } from 'mongoose';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;
    const body = await request.json();

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid donation ID',
        },
        { status: 400 }
      );
    }

    const donation = await Donation.findByIdAndUpdate(
      id,
      {
        $set: {
          title: body.title,
          description: body.description,
          quantity: body.quantity,
          unit: body.unit,
          expiryDate: body.expiryDate,
          pickupLocation: body.pickupLocation,
          status: body.status,
        },
      },
      { new: true }
    );

    if (!donation) {
      return NextResponse.json(
        {
          success: false,
          message: 'Donation not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Donation updated successfully',
        data: donation,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update donation error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update donation',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid donation ID',
        },
        { status: 400 }
      );
    }

    const donation = await Donation.findByIdAndDelete(id);

    if (!donation) {
      return NextResponse.json(
        {
          success: false,
          message: 'Donation not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Donation deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete donation error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete donation',
      },
      { status: 500 }
    );
  }
}
