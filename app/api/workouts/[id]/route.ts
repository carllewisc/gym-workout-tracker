import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { WorkoutService } from '@/services/workoutService';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  await connectDB();

  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const workout = await WorkoutService.getWorkoutById(id);

    if (!workout) {
      return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
    }

    return NextResponse.json(workout);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch workout' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  await connectDB();

  try {
    await WorkoutService.deleteWorkout(params.id);
    return NextResponse.json({ message: 'Workout deleted' });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Workout not found') {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
      if (error.message === 'Invalid exercise ID') {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }
    return NextResponse.json({ error: 'Failed to delete workout' }, { status: 500 });
  }
}
