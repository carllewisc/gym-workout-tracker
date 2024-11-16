'use client';

import { useState, Fragment } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  ChevronDown,
  ChevronUp,
  Download,
  Eye,
  Pencil,
  Trash
} from 'lucide-react';
import Link from 'next/link';

// TODO: Replace with actual API response (Interface for the workout object)
interface Workout {
  _id: string;
  date: string;
  totalReps: number;
  totalWeight: number;
  exercises: { name: string; sets: { weight: number; reps: number }[] }[];
}

export default function WorkoutListingPage({
  workouts
}: {
  workouts: Workout[];
}) {
  const [expandedWorkout, setExpandedWorkout] = useState<string | null>(null);

  const toggleExpand = (workoutId: string) => {
    setExpandedWorkout(expandedWorkout === workoutId ? null : workoutId);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Workout List</h1>
        <Link href="/dashboard/workout/create">
          <Button>Create Workout</Button>
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Exercises</TableHead>
            <TableHead className="text-right">Total Reps</TableHead>
            <TableHead className="text-right">Total Weight</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workouts.map((workout) => (
            <Fragment key={workout._id}>
              <TableRow>
                <TableCell>
                  {new Date(workout.date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={() => toggleExpand(workout._id)}
                  >
                    <span className="sr-only">
                      {expandedWorkout === workout._id
                        ? 'Close menu'
                        : 'Open menu'}
                    </span>
                    {expandedWorkout === workout._id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </TableCell>
                <TableCell className="text-right">
                  {workout.totalReps}
                </TableCell>
                <TableCell className="text-right">
                  {workout.totalWeight} kg
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    href={`/dashboard/workout/${workout._id}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md p-0 hover:bg-accent hover:text-accent-foreground"
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View</span>
                  </Link>
                  <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download</span>
                  </Button>
                </TableCell>
              </TableRow>
              {expandedWorkout === workout._id && (
                <TableRow>
                  <TableCell colSpan={5}>
                    <div className="rounded-md bg-muted/50 p-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Exercise</TableHead>
                            <TableHead>Sets</TableHead>
                            <TableHead className="text-right">Reps</TableHead>
                            <TableHead className="text-right">Weight</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {workout.exercises.map((exercise, index) => (
                            <TableRow key={index}>
                              <TableCell>{exercise.name}</TableCell>
                              <TableCell>
                                {exercise.sets.map((set, setIndex) => (
                                  <span
                                    key={setIndex}
                                    className="mb-1 mr-2 inline-block rounded-md bg-muted px-2 py-1 text-sm"
                                  >
                                    {set.weight}kg × {set.reps}
                                  </span>
                                ))}
                              </TableCell>
                              <TableCell className="text-right">
                                {exercise.sets.reduce(
                                  (total, set) => total + set.reps,
                                  0
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                {exercise.sets.reduce(
                                  (total, set) => total + set.weight * set.reps,
                                  0
                                )}{' '}
                                kg
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
