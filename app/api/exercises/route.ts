import { NextResponse } from 'next/server';
import { ExerciseService } from '@/services/exerciseService';
import { connectDB } from '@/lib/mongodb';

export async function GET(request: Request) {
  await connectDB();

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const muscle = searchParams.get('muscle') || '';

    let result;
    if (search) {
      result = await ExerciseService.searchExercises(search, muscle);
    } else if (muscle) {
      result = await ExerciseService.getExercisesByMuscle(muscle);
    } else {
      result = await ExerciseService.getExercises(page, limit);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.log('error', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to fetch exercises' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await connectDB();

  try {
    const body = await request.json();
    const exercise = await ExerciseService.createExercise(body);
    return NextResponse.json(exercise, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create exercise' }, { status: 500 });
  }
}
