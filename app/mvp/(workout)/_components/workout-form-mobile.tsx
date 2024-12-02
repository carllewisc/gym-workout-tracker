'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { ExerciseSheet } from './components/exercise-sheet';
import { ExerciseCard } from './components/exercise-card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { createWorkout, fetchAllExercises } from '../_api';

// TODO: interface Exercise, Set, ApiExercise duplicated in api.d.ts
interface Set {
  weight: string;
  reps: string;
}

interface Exercise {
  id: string;
  name: string;
  muscle: string;
  sets: Set[];
}

interface ApiExercise {
  _id: string;
  name: string;
  muscle: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export default function WorkoutFormMobile() {
  const [exercises, setExercises] = React.useState<Exercise[]>([]);
  const [apiExercises, setApiExercises] = React.useState<ApiExercise[]>([]);
  const [bodyweight, setBodyweight] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    fetchAllExercises()
      .then((response) => {
        setApiExercises(response.exercises);
        setIsLoading(false);
      })
      .catch(() => {
        toast.error('Failed to load exercises');
        setIsLoading(false);
      });
  }, []);

  const handleAddExercise = (exercise: ApiExercise) => {
    setExercises((prev) => {
      const exerciseExists = prev.some((e) => e.id === exercise._id);
      if (!exerciseExists) {
        return [
          ...prev,
          {
            id: exercise._id,
            name: exercise.name,
            muscle: exercise.muscle,
            sets: [{ weight: '', reps: '' }]
          }
        ];
      }
      return prev;
    });
  };

  const handleUpdateSet = (exerciseId: string, setIndex: number, field: 'weight' | 'reps', value: string) => {
    setExercises((prev) =>
      prev.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map((set, j) => (j === setIndex ? { ...set, [field]: value } : set))
            }
          : exercise
      )
    );
  };

  const handleAddSet = (exerciseId: string) => {
    setExercises((prev) =>
      prev.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: [...exercise.sets, { weight: '', reps: '' }]
            }
          : exercise
      )
    );
  };

  const handleRemoveSet = (exerciseId: string, setIndex: number) => {
    setExercises((prev) =>
      prev.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.filter((_, j) => j !== setIndex)
            }
          : exercise
      )
    );
  };

  const handleRemoveExercise = (id: string) => {
    setExercises((prev) => prev.filter((exercise) => exercise.id !== id));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await createWorkout({
        exercises,
        bodyweight,
        notes
      });
      toast.success('Workout created successfully');
      resetForm();
    } catch (error) {
      toast.error('Failed to create workout');
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setExercises([]);
    setBodyweight('');
    setNotes('');
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading exercises...</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col md:hidden">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between px-4">
          <h1 className="text-lg font-semibold">Gym Workout</h1>
          <div className="flex items-center gap-2">
            <time className="text-sm text-muted-foreground">{new Date().toLocaleDateString()}</time>
          </div>
        </div>
      </header>

      <div className="flex-1 space-y-4 p-4">
        <ExerciseSheet exercises={apiExercises} onSelectExercise={handleAddExercise} selectedExercises={exercises} />

        <ScrollArea className="h-[calc(100vh-13rem)]">
          <div className="space-y-4">
            {exercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                name={exercise.name}
                muscle={exercise.muscle}
                sets={exercise.sets}
                onUpdateSet={(setIndex, field, value) => handleUpdateSet(exercise.id, setIndex, field, value)}
                onAddSet={() => handleAddSet(exercise.id)}
                onRemoveSet={(setIndex) => handleRemoveSet(exercise.id, setIndex)}
                onRemoveExercise={() => handleRemoveExercise(exercise.id)}
              />
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="sticky bottom-0 space-y-4 border-t bg-background p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Bodyweight</label>
            <div className="mt-1 flex items-center gap-2">
              <Input
                type="number"
                value={bodyweight}
                onChange={(e) => setBodyweight(e.target.value)}
                className="h-12"
              />
              <span className="text-muted-foreground">kg</span>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Notes</label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1" rows={1} />
          </div>
        </div>
        <Button className="h-12 w-full" onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Workout'
          )}
        </Button>
      </div>
    </div>
  );
}
