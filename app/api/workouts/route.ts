import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { WorkoutService } from '@/services/workoutService';

export async function GET() {
  await connectDB();

  try {
    const workout = await WorkoutService.getWorkouts();
    return NextResponse.json(workout);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch gyms' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  await connectDB();

  try {
    const body = await request.json();
    const workout = await WorkoutService.createWorkout(body);
    return NextResponse.json(workout, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create gym' },
      { status: 500 }
    );
  }
}
