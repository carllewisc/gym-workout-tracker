import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { ExerciseService } from '@/services/exerciseService';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  await connectDB();

  try {
    const exercise = await ExerciseService.getExerciseById(params.id);
    return NextResponse.json(exercise);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Exercise not found') {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
      if (error.message === 'Invalid exercise ID') {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }
    return NextResponse.json({ error: 'Failed to fetch exercise' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await connectDB();

  try {
    const body = await request.json();
    const exercise = await ExerciseService.updateExercise(params.id, body);
    return NextResponse.json(exercise);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Exercise not found') {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
      if (error.message === 'Invalid exercise ID') {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }
    return NextResponse.json({ error: 'Failed to update exercise' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  await connectDB();

  try {
    await ExerciseService.deleteExercise(params.id);
    return NextResponse.json({ message: 'Exercise deleted successfully' });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Exercise not found') {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
      if (error.message === 'Invalid exercise ID') {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }
    return NextResponse.json({ error: 'Failed to delete exercise' }, { status: 500 });
  }
}
