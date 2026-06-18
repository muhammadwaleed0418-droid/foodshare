import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/src/actions/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = await loginUser(body);

    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          message: 'Login successful',
          redirect: 'redirect' in result ? result.redirect : undefined,
          credentials: 'credentials' in result ? result.credentials : undefined,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'error' in result ? result.error : 'Login failed',
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}