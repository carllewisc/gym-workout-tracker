import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { AuthService } from '@/services/authService';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    const user = await AuthService.registerUser(validatedData);

    return NextResponse.json(
      {
        user,
        message: 'Registration successful'
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: error.errors[0].message
        },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      if (error.message === 'Email already registered') {
        return NextResponse.json(
          {
            error: error.message
          },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      {
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}
