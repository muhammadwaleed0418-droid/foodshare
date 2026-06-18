import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/src/lib/database';
import { Donation, User } from '@/src/models';

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
      query.donorId = userId;
    }

    if (status) {
      query.status = status;
    }

    const donations = await Donation.find(query)
      .populate('donorId', 'name email profileImage rating')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Donation.countDocuments(query);

    return NextResponse.json(
      {
        success: true,
        data: donations,
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
    console.error('Get donations error:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch donations',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    console.log('POST /api/donations received:', body);
    
    const { donorId, title, description, quantity, unit, expiryDate, pickupLocation } = body;

    if (!donorId) {
      console.log('Missing donorId');
      return NextResponse.json(
        {
          success: false,
          message: 'Missing donorId. You must be logged in.',
        },
        { status: 400 }
      );
    }

    if (!title || !quantity) {
      console.log('Missing title or quantity');
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields: title and quantity',
        },
        { status: 400 }
      );
    }

    // Verify donor exists
    console.log('Looking for donor with ID:', donorId);
    const donor = await User.findById(donorId);
    
    if (!donor) {
      console.log('Donor not found by ID:', donorId);
      console.log('Checking database...');
      const count = await User.countDocuments({});
      console.log('Total users in collection:', count);
      
      return NextResponse.json(
        {
          success: false,
          message: 'User account not found. Please log in again.',
          debug: { donorId, totalUsersInDB: count }
        },
        { status: 404 }
      );
    }

    // Ensure description is at least 10 characters (required by Donation schema)
    let finalDescription = description;
    if (!finalDescription || finalDescription.trim().length < 10) {
      finalDescription = 'A donation of ' + title + ' for food sharing purposes.';
    }

    // Parse pickup location if it's a string (format: "street, city, state, zip")
    let parsedLocation: any = {
      street: 'Pickup Location',
      city: 'Not Specified',
      state: 'Not Specified',
      zipCode: '00000',
    };

    if (typeof pickupLocation === 'string' && pickupLocation.trim()) {
      const parts = pickupLocation.split(',').map(p => p.trim());
      if (parts.length >= 4) {
        parsedLocation = {
          street: parts[0] || 'Pickup Location',
          city: parts[1] || 'Not Specified',
          state: parts[2] || 'Not Specified',
          zipCode: parts[3] || '00000',
        };
      } else if (parts.length >= 2) {
        parsedLocation = {
          street: parts[0] || 'Pickup Location',
          city: parts[1] || 'Not Specified',
          state: 'Not Specified',
          zipCode: '00000',
        };
      } else if (parts.length === 1) {
        parsedLocation = {
          street: parts[0] || 'Pickup Location',
          city: 'Not Specified',
          state: 'Not Specified',
          zipCode: '00000',
        };
      }
    } else if (typeof pickupLocation === 'object' && pickupLocation) {
      parsedLocation = {
        street: pickupLocation.street || 'Pickup Location',
        city: pickupLocation.city || 'Not Specified',
        state: pickupLocation.state || 'Not Specified',
        zipCode: pickupLocation.zipCode || '00000',
      };
    }

    // Set availableUntil from expiryDate or 7 days from now
    const availableUntil = expiryDate ? new Date(expiryDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    console.log('Creating donation with:', {
      donorId,
      title,
      description: finalDescription,
      quantity,
      unit,
      foodType: ['other'],
      pickupLocation: parsedLocation,
      availableUntil,
    });

    const donation = await Donation.create({
      donorId,
      title,
      description: finalDescription,
      foodType: ['other'], // Default to 'other' category
      quantity: parseFloat(quantity) || 1,
      unit: unit || 'kg',
      availableFrom: new Date(),
      availableUntil: availableUntil,
      pickupLocation: parsedLocation,
      status: 'available',
    });

    console.log('Donation created successfully:', donation);

    // Update donor's totalDonations
    await User.findByIdAndUpdate(donorId, {
      $inc: { totalDonations: 1 },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Donation created successfully',
        data: donation,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create donation error:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create donation',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
