'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Share2, Trash2, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { createWorkout, fetchAllExercises } from '../_api';

interface Set {
  weight: string;
  reps: string;
}

interface Exercise {
  id: number;
  name: string;
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

export default function WorkoutForm() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [apiExercises, setApiExercises] = useState<ApiExercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bodyweight, setBodyweight] = useState('');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState('');

  useEffect(() => {
    fetchAllExercises()
      .then((response) => {
        setApiExercises(response.exercises);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching exercises:', error);
        toast.error('Failed to load exercises');
        setIsLoading(false);
      });
  }, []);

  const handleSetChange = (exerciseId: number, setIndex: number, field: 'weight' | 'reps', value: string) => {
    setExercises((prevExercises) =>
      prevExercises.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map((set, idx) => (idx === setIndex ? { ...set, [field]: value } : set))
            }
          : exercise
      )
    );
  };

  const handleExerciseNameChange = (exerciseId: number, newName: string) => {
    setExercises((prevExercises) =>
      prevExercises.map((exercise) => (exercise.id === exerciseId ? { ...exercise, name: newName } : exercise))
    );
  };

  const addNewExercise = () => {
    if (!newExerciseName.trim()) {
      toast.error('Please select an exercise');
      return;
    }

    const newId = Math.max(0, ...exercises.map((e) => e.id)) + 1;
    const newExercise: Exercise = {
      id: newId,
      name: newExerciseName,
      sets: [
        { weight: '0', reps: '0' },
        { weight: '0', reps: '0' },
        { weight: '0', reps: '0' },
        { weight: '0', reps: '0' }
      ]
    };

    setExercises([...exercises, newExercise]);
    setNewExerciseName('');
    toast.success('Exercise added successfully');
  };

  const removeExercise = (exerciseId: number) => {
    setExercises(exercises.filter((exercise) => exercise.id !== exerciseId));
    toast.success('Exercise removed');
  };

  const calculateTotal = () => {
    let totalReps = 0;
    let totalWeight = 0;

    exercises.forEach((exercise) => {
      exercise.sets.forEach((set) => {
        const reps = parseInt(set.reps) || 0;
        const weight = parseFloat(set.weight) || 0;
        totalReps += reps;
        totalWeight += weight * reps;
      });
    });

    return { totalReps, totalWeight };
  };

  const { totalReps, totalWeight } = calculateTotal();

  const resetForm = () => {
    setExercises([]);
    setBodyweight('');
    setNotes('');
    setNewExerciseName('');
  };

  const handleCreateWorkout = async () => {
    setIsSaving(true);

    try {
      const workout = await createWorkout({
        exercises,
        bodyweight,
        notes
      });
      toast.success('Workout created successfully');
      console.log('Created workout:', workout);
      resetForm();
    } catch (error) {
      console.error('Error creating workout:', error);
      toast.error('Failed to create workout');
    } finally {
      setIsSaving(false);
    }
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
    <div className="container mx-auto max-w-5xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gym Workout</h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <time className="text-sm text-muted-foreground">{new Date().toLocaleDateString()}</time>
        </div>
      </div>

      <div className="mb-4 flex items-end gap-2">
        <div className="flex-1">
          <Label htmlFor="new-exercise">Add Exercise</Label>
          <Select value={newExerciseName} onValueChange={setNewExerciseName}>
            <SelectTrigger id="new-exercise" className="mt-2">
              <SelectValue placeholder="Select an exercise" />
            </SelectTrigger>
            <SelectContent>
              {apiExercises.map((exercise) => (
                <SelectItem key={exercise._id} value={exercise.name}>
                  {exercise.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={addNewExercise}>
          <Plus className="mr-2 h-4 w-4" />
          Add Exercise
        </Button>
      </div>

      <div className="mb-6 overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead className="w-[200px]">Exercise</TableHead>
              <TableHead>Sets</TableHead>
              <TableHead className="text-right">Reps</TableHead>
              <TableHead className="text-right">Weight</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exercises.map((exercise, index) => (
              <TableRow key={exercise.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Select value={exercise.name} onValueChange={(value) => handleExerciseNameChange(exercise.id, value)}>
                    <SelectTrigger className="max-w-[200px]">
                      <SelectValue placeholder="Select an exercise" />
                    </SelectTrigger>
                    <SelectContent>
                      {apiExercises.map((apiExercise) => (
                        <SelectItem key={apiExercise._id} value={apiExercise.name}>
                          {apiExercise.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    {exercise.sets.map((set, setIndex) => (
                      <div key={setIndex} className="flex items-center gap-1">
                        <Input
                          type="number"
                          min={0}
                          value={set.weight}
                          onChange={(e) => handleSetChange(exercise.id, setIndex, 'weight', e.target.value)}
                          className="h-8 w-16 text-sm"
                          aria-label={`Weight for set ${setIndex + 1}`}
                        />
                        <span>kg ×</span>
                        <Input
                          type="number"
                          min={0}
                          value={set.reps}
                          onChange={(e) => handleSetChange(exercise.id, setIndex, 'reps', e.target.value)}
                          className="h-8 w-16 text-sm"
                          aria-label={`Reps for set ${setIndex + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {exercise.sets.reduce((acc, set) => acc + (parseInt(set.reps) || 0), 0)}
                </TableCell>
                <TableCell className="text-right">
                  {exercise.sets.reduce(
                    (acc, set) => acc + (parseFloat(set.weight) || 0) * (parseInt(set.reps) || 0),
                    0
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeExercise(exercise.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={4} className="font-medium">
                Total:
              </TableCell>
              <TableCell className="text-right font-medium">{totalReps} Reps</TableCell>
              <TableCell className="text-right font-medium">{totalWeight.toFixed(1)}kg</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="bodyweight">Bodyweight:</Label>
          <div className="mt-2 flex items-center gap-2">
            <Input
              id="bodyweight"
              type="number"
              value={bodyweight}
              onChange={(e) => setBodyweight(e.target.value)}
              className="w-24"
            />
            <span className="text-muted-foreground">kg</span>
          </div>
        </div>

        <div>
          <Label htmlFor="notes">Notes:</Label>
          <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-2" rows={4} />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t pt-6">
        <div className="flex items-center gap-2">
          <Button onClick={handleCreateWorkout} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save workout'
            )}
          </Button>
          <Button variant="destructive" onClick={resetForm} disabled={isSaving}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete workout
          </Button>
        </div>
      </div>
    </div>
  );
}
