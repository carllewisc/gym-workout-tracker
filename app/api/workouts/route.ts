import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { WorkoutService } from '@/services/workoutService';
import { AuthUser, withAuth } from '@/lib/auth-utils';

async function handleGet(request: Request, user: AuthUser) {
  await connectDB();

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const workout = await WorkoutService.getWorkouts(page, limit);
    return NextResponse.json(workout);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch gyms' }, { status: 500 });
  }
}

async function handlePost(request: Request, user: AuthUser) {
  try {
    await connectDB();
    const body = await request.json();

    const workout = await WorkoutService.createWorkout({
      ...body,
      userId: user.id
    });

    return NextResponse.json(workout, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create workout' }, { status: 500 });
  }
}

export const GET = withAuth(handleGet);
export const POST = withAuth(handlePost);
