'use client';

import * as React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus } from 'lucide-react';

interface ApiExercise {
  _id: string;
  name: string;
  muscle: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

interface ExerciseSheetProps {
  exercises: ApiExercise[];
  onSelectExercise: (exercise: ApiExercise) => void;
  selectedExercises: { id: string; name: string; muscle: string; sets: Array<{ weight: string; reps: string }> }[];
}

export function ExerciseSheet({ exercises, onSelectExercise, selectedExercises }: ExerciseSheetProps) {
  const isSelected = (exercise: ApiExercise) => {
    return selectedExercises.some((selected) => selected.id === exercise._id);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="w-full gap-2" size="lg">
          <Plus className="h-5 w-5" />
          Add Exercise
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh]">
        <SheetHeader>
          <SheetTitle>Select Exercise</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-full py-4">
          <div className="grid gap-2">
            {exercises.map((exercise) => (
              <Button
                key={exercise._id}
                variant={isSelected(exercise) ? 'secondary' : 'ghost'}
                className="h-auto justify-start px-4 py-6 text-left"
                onClick={() => onSelectExercise(exercise)}
              >
                <div>
                  <div className="font-medium">{exercise.name}</div>
                  <div className="text-sm text-muted-foreground">{exercise.muscle}</div>
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
