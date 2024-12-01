'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Pencil, Trash2, Plus } from 'lucide-react';
import Image from 'next/image';
import { fetchExercises, createExercise, updateExercise, deleteExercise } from '../_api';

type MuscleGroup = 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Biceps' | 'Triceps';

interface Exercise {
  _id: string;
  name: string;
  muscle: MuscleGroup;
  image: string;
}

const muscleGroups: MuscleGroup[] = ['Chest', 'Back', 'Legs', 'Shoulders', 'Biceps', 'Triceps'];

export default function ExerciseManagement() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [exerciseToDelete, setExerciseToDelete] = useState<Exercise | null>(null);
  const [newExercise, setNewExercise] = useState<Partial<Omit<Exercise, '_id'>>>({
    name: '',
    image: ''
  });

  useEffect(() => {
    const loadExercises = async () => {
      try {
        const data = await fetchExercises();
        setExercises(data.exercises);
      } catch (err) {
        setError('Failed to load exercises');
      } finally {
        setIsLoading(false);
      }
    };

    void loadExercises();
  }, []);

  const handleAddExercise = async () => {
    try {
      const createdExercise = await createExercise(newExercise);
      setExercises([...exercises, createdExercise]);
      setNewExercise({ name: '', muscle: 'Chest', image: '' });
      setIsAddDialogOpen(false);
    } catch (err) {
      setError('Failed to create exercise');
    }
  };

  const handleEditExercise = async () => {
    if (currentExercise) {
      try {
        const updatedExercise = await updateExercise(currentExercise._id, currentExercise);
        setExercises(exercises.map((ex) => (ex._id === updatedExercise._id ? updatedExercise : ex)));
        setIsEditDialogOpen(false);
      } catch (err) {
        setError('Failed to update exercise');
      }
    }
  };

  const handleDeleteExercise = async () => {
    if (exerciseToDelete) {
      try {
        await deleteExercise(exerciseToDelete._id);
        setExercises(exercises.filter((ex) => ex._id !== exerciseToDelete._id));
        setIsDeleteDialogOpen(false);
        setExerciseToDelete(null);
      } catch (err) {
        setError('Failed to delete exercise');
      }
    }
  };

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading exercises...</div>;
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Exercise Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Exercise
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Exercise</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newExercise.name}
                  onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="muscle" className="text-right">
                  Muscle
                </Label>
                <Select
                  value={newExercise.muscle || ''}
                  onValueChange={(value: MuscleGroup) => setNewExercise({ ...newExercise, muscle: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select muscle group" />
                  </SelectTrigger>
                  <SelectContent>
                    {muscleGroups.map((muscle) => (
                      <SelectItem key={muscle} value={muscle}>
                        {muscle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image" className="text-right">
                  Image URL
                </Label>
                <Input
                  id="image"
                  value={newExercise.image}
                  onChange={(e) => setNewExercise({ ...newExercise, image: e.target.value })}
                  className="col-span-3"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddExercise}>Add Exercise</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Muscle</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exercises.map((exercise) => (
            <TableRow key={exercise._id}>
              <TableCell>
                <div className="relative h-[50px] w-[50px]">
                  <Image
                    src={
                      exercise.image ||
                      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=50&h=50&fit=crop'
                    }
                    alt={exercise.name}
                    width={50}
                    height={50}
                    className="rounded-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=50&h=50&fit=crop';
                    }}
                  />
                </div>
              </TableCell>
              <TableCell className="font-medium">{exercise.name}</TableCell>
              <TableCell>{exercise.muscle}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setCurrentExercise(exercise);
                    setIsEditDialogOpen(true);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Edit {exercise.name}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-[#8B4513] hover:text-white"
                  onClick={() => {
                    setExerciseToDelete(exercise);
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete {exercise.name}</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Exercise</DialogTitle>
          </DialogHeader>
          {currentExercise && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  value={currentExercise.name}
                  onChange={(e) => setCurrentExercise({ ...currentExercise, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-muscle" className="text-right">
                  Muscle
                </Label>
                <Select
                  value={currentExercise.muscle}
                  onValueChange={(value: MuscleGroup) => setCurrentExercise({ ...currentExercise, muscle: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select muscle group" />
                  </SelectTrigger>
                  <SelectContent>
                    {muscleGroups.map((muscle) => (
                      <SelectItem key={muscle} value={muscle}>
                        {muscle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-image" className="text-right">
                  Image URL
                </Label>
                <Input
                  id="edit-image"
                  value={currentExercise.image}
                  onChange={(e) => setCurrentExercise({ ...currentExercise, image: e.target.value })}
                  className="col-span-3"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleEditExercise}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to delete the exercise <b>{exerciseToDelete?.name}</b>? This action cannot be undone.
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteExercise}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
