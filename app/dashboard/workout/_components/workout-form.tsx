'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Loader2, Share2, Trash2, Plus, X } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { createWorkout } from '../_api';

interface Set {
  weight: string;
  reps: string;
}

interface Exercise {
  id: number;
  name: string;
  sets: Set[];
}

export default function WorkoutForm() {
  const [exercises, setExercises] = useState<Exercise[]>([
    {
      id: 1,
      name: 'Bench Press',
      sets: [
        { weight: '0', reps: '0' },
        { weight: '0', reps: '0' },
        { weight: '0', reps: '0' }
      ]
    },
    {
      id: 2,
      name: 'Incline Bench Press',
      sets: [
        { weight: '0', reps: '0' },
        { weight: '0', reps: '0' }
      ]
    }
  ]);

  const [bodyweight, setBodyweight] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newExerciseName, setNewExerciseName] = useState('');

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
      toast.error('Please enter an exercise name');
      return;
    }

    const newId = Math.max(0, ...exercises.map((e) => e.id)) + 1;
    const newExercise: Exercise = {
      id: newId,
      name: newExerciseName,
      sets: [
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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPictureClick = () => {
    fileInputRef.current?.click();
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
    } catch (error) {
      console.error('Error creating workout:', error);
      toast.error('Failed to create workout');
    } finally {
      setIsSaving(false);
    }
  };

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
          <Input
            id="new-exercise"
            value={newExerciseName}
            onChange={(e) => setNewExerciseName(e.target.value)}
            placeholder="Enter exercise name"
            className="mt-2"
          />
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
              <TableHead>Exercise</TableHead>
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
                  <Input
                    value={exercise.name}
                    onChange={(e) => handleExerciseNameChange(exercise.id, e.target.value)}
                    className="max-w-[200px]"
                  />
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

      <div className="mt-6">
        <Label htmlFor="progress-image">Progress Image:</Label>
        <div className="mt-2 rounded-lg border p-4">
          {selectedImage ? (
            <Image src={selectedImage} alt="Progress" width={200} height={200} className="rounded-lg" />
          ) : (
            <div className="flex h-[200px] w-[200px] items-center justify-center rounded-lg bg-muted">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
          <Button variant="secondary" className="mt-4 cursor-pointer" onClick={handleSelectPictureClick}>
            Select picture
          </Button>
          <Input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="sr-only"
            ref={fileInputRef}
          />
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
          <Button variant="destructive" disabled={isSaving}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete workout
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" disabled={isSaving}>
            Add to my workout plans
          </Button>
          <Button variant="outline" disabled={isSaving}>
            <Download className="mr-2 h-4 w-4" />
            Download .xls
          </Button>
        </div>
      </div>
    </div>
  );
}
