import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from '@/src/actions/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = await registerUser(body);

    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          message: 'Registration successful',
          user: result.user,
        },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: result.message || 'Registration failed',
          errors: result.errors,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Register API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
