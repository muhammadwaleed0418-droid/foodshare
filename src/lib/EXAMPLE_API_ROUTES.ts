/**
 * Example API Routes for Food Share Application
 * These are Next.js API route examples for CRUD operations
 * 
 * Location: app/api/[resource]/route.ts
 */

// ========================================
// EXAMPLE: app/api/donations/route.ts
// ========================================

// import { NextRequest, NextResponse } from 'next/server';
// import connectDB from '@/lib/database';
// import { Donation } from '@/models';
// import { donationCreateSchema, donationFilterSchema } from '@/lib/validations';
// import { authenticate } from '@/middleware/auth';

// export async function GET(request: NextRequest) {
//   try {
//     await connectDB();

//     // Parse query parameters
//     const { searchParams } = new URL(request.url);
//     const filters = {
//       status: searchParams.get('status'),
//       foodType: searchParams.getAll('foodType'),
//       city: searchParams.get('city'),
//       page: Number(searchParams.get('page')) || 1,
//       limit: Number(searchParams.get('limit')) || 10,
//     };

//     // Validate filters
//     const validFilters = donationFilterSchema.parse(filters);

//     // Build query
//     const query: any = {};
//     if (validFilters.status) query.status = validFilters.status;
//     if (validFilters.foodType?.length) query.foodType = { $in: validFilters.foodType };
//     if (validFilters.city) query['pickupLocation.city'] = validFilters.city;

//     // Execute query with pagination
//     const skip = (validFilters.page - 1) * validFilters.limit;
//     const donations = await Donation.find(query)
//       .populate('donorId', 'name email rating')
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(validFilters.limit);

//     const total = await Donation.countDocuments(query);

//     return NextResponse.json(
//       {
//         success: true,
//         data: donations,
//         pagination: {
//           page: validFilters.page,
//           limit: validFilters.limit,
//           total,
//           pages: Math.ceil(total / validFilters.limit),
//         },
//       },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     // Authenticate user
//     const user = await authenticate(request);
//     if (!user) {
//       return NextResponse.json(
//         { success: false, error: 'Unauthorized' },
//         { status: 401 }
//       );
//     }

//     await connectDB();
//     const body = await request.json();

//     // Validate input
//     const validData = donationCreateSchema.parse(body);

//     // Create donation
//     const donation = await Donation.create({
//       ...validData,
//       donorId: user._id,
//     });

//     // Log audit
//     await AuditLog.create({
//       action: 'CREATE',
//       userId: user._id,
//       targetId: donation._id,
//       targetType: 'donation',
//       status: 'success',
//       ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
//     });

//     return NextResponse.json(
//       { success: true, data: donation },
//       { status: 201 }
//     );
//   } catch (error: any) {
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: error.status || 500 }
//     );
//   }
// }

// ========================================
// EXAMPLE: app/api/donations/[id]/route.ts
// ========================================

// export async function GET(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     await connectDB();

//     const donation = await Donation.findById(params.id).populate(
//       'donorId',
//       'name email rating bio'
//     );

//     if (!donation) {
//       return NextResponse.json(
//         { success: false, error: 'Donation not found' },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(
//       { success: true, data: donation },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }

// export async function PUT(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const user = await authenticate(request);
//     if (!user) {
//       return NextResponse.json(
//         { success: false, error: 'Unauthorized' },
//         { status: 401 }
//       );
//     }

//     await connectDB();
//     const body = await request.json();

//     // Find donation
//     const donation = await Donation.findById(params.id);
//     if (!donation) {
//       return NextResponse.json(
//         { success: false, error: 'Donation not found' },
//         { status: 404 }
//       );
//     }

//     // Check ownership
//     if (donation.donorId.toString() !== user._id.toString()) {
//       return NextResponse.json(
//         { success: false, error: 'Forbidden' },
//         { status: 403 }
//       );
//     }

//     // Validate and update
//     const validData = donationUpdateSchema.parse(body);
//     Object.assign(donation, validData);
//     await donation.save();

//     // Log audit
//     await AuditLog.create({
//       action: 'UPDATE',
//       userId: user._id,
//       targetId: donation._id,
//       targetType: 'donation',
//       changes: { before: {}, after: validData },
//       status: 'success',
//     });

//     return NextResponse.json(
//       { success: true, data: donation },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: error.status || 500 }
//     );
//   }
// }

// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const user = await authenticate(request);
//     if (!user) {
//       return NextResponse.json(
//         { success: false, error: 'Unauthorized' },
//         { status: 401 }
//       );
//     }

//     await connectDB();

//     const donation = await Donation.findById(params.id);
//     if (!donation) {
//       return NextResponse.json(
//         { success: false, error: 'Donation not found' },
//         { status: 404 }
//       );
//     }

//     if (donation.donorId.toString() !== user._id.toString()) {
//       return NextResponse.json(
//         { success: false, error: 'Forbidden' },
//         { status: 403 }
//       );
//     }

//     await Donation.findByIdAndDelete(params.id);

//     // Log audit
//     await AuditLog.create({
//       action: 'DELETE',
//       userId: user._id,
//       targetId: params.id,
//       targetType: 'donation',
//       status: 'success',
//     });

//     return NextResponse.json(
//       { success: true, message: 'Donation deleted' },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }

// ========================================
// EXAMPLE: app/api/reservations/route.ts
// ========================================

// export async function POST(request: NextRequest) {
//   try {
//     const user = await authenticate(request);
//     if (!user) {
//       return NextResponse.json(
//         { success: false, error: 'Unauthorized' },
//         { status: 401 }
//       );
//     }

//     await connectDB();
//     const body = await request.json();

//     const validData = reservationCreateSchema.parse(body);

//     // Check if donation exists and is available
//     const donation = await Donation.findById(validData.donationId);
//     if (!donation) {
//       return NextResponse.json(
//         { success: false, error: 'Donation not found' },
//         { status: 404 }
//       );
//     }

//     if (donation.status !== 'AVAILABLE') {
//       return NextResponse.json(
//         { success: false, error: 'Donation is not available' },
//         { status: 400 }
//       );
//     }

//     // Create reservation
//     const reservation = await Reservation.create({
//       ...validData,
//       receiverId: user._id,
//     });

//     // Update donation status
//     donation.status = 'RESERVED';
//     await donation.save();

//     return NextResponse.json(
//       { success: true, data: reservation },
//       { status: 201 }
//     );
//   } catch (error: any) {
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: error.status || 500 }
//     );
//   }
// }

// ========================================
// EXAMPLE: app/api/messages/route.ts
// ========================================

// export async function GET(request: NextRequest) {
//   try {
//     const user = await authenticate(request);
//     if (!user) {
//       return NextResponse.json(
//         { success: false, error: 'Unauthorized' },
//         { status: 401 }
//       );
//     }

//     await connectDB();

//     const { searchParams } = new URL(request.url);
//     const conversationId = searchParams.get('conversationId');

//     const messages = await Message.find({
//       $or: [{ senderId: user._id }, { receiverId: user._id }],
//     })
//       .sort({ createdAt: -1 })
//       .limit(50);

//     return NextResponse.json(
//       { success: true, data: messages },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     const user = await authenticate(request);
//     if (!user) {
//       return NextResponse.json(
//         { success: false, error: 'Unauthorized' },
//         { status: 401 }
//       );
//     }

//     await connectDB();
//     const body = await request.json();

//     const validData = messageCreateSchema.parse(body);

//     const message = await Message.create({
//       ...validData,
//       senderId: user._id,
//     });

//     return NextResponse.json(
//       { success: true, data: message },
//       { status: 201 }
//     );
//   } catch (error: any) {
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: error.status || 500 }
//     );
//   }
// }
