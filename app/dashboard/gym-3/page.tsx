'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Share2, Plus, X, Save, Trash2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';

type Set = {
  weight: string;
  reps: string;
};

type Exercise = {
  id: string;
  name: string;
  sets: Set[];
};

const exerciseList = [
  'Bench Press',
  'Squat',
  'Deadlift',
  'Overhead Press',
  'Barbell Row',
  'Pull-ups',
  'Dips',
  'Lunges',
  'Leg Press',
  'Lat Pulldown',
  'Bicep Curls',
  'Tricep Extensions',
  'Leg Curls',
  'Leg Extensions',
  'Calf Raises'
];

export default function SpreadsheetWorkoutTracker() {
  const { toast } = useToast();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [bodyweight, setBodyweight] = useState('');
  const [notes, setNotes] = useState('');

  const addExercise = () => {
    if (selectedExercise.trim() === '') return;
    const newExercise: Exercise = {
      id: `exercise-${Date.now()}`,
      name: selectedExercise,
      sets: [{ weight: '', reps: '' }]
    };
    setExercises([...exercises, newExercise]);
    setSelectedExercise('');
    toast({
      title: 'Exercise Added',
      description: `${selectedExercise} has been added to your workout.`
    });
  };

  const removeExercise = (id: string) => {
    setExercises(exercises.filter((ex) => ex.id !== id));
  };

  const updateExercise = (id: string, field: keyof Exercise, value: any) => {
    setExercises(exercises.map((ex) => (ex.id === id ? { ...ex, [field]: value } : ex)));
  };

  const updateSet = (exerciseId: string, setIndex: number, field: keyof Set, value: string) => {
    setExercises(
      exercises.map((ex) =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: ex.sets.map((set, index) => (index === setIndex ? { ...set, [field]: value } : set))
            }
          : ex
      )
    );
  };

  const addSet = (exerciseId: string) => {
    setExercises(
      exercises.map((ex) => (ex.id === exerciseId ? { ...ex, sets: [...ex.sets, { weight: '', reps: '' }] } : ex))
    );
  };

  const calculateTotalReps = (exercise: Exercise) => {
    return exercise.sets.reduce((total, set) => total + (parseInt(set.reps) || 0), 0);
  };

  const calculateTotalWeight = (exercise: Exercise) => {
    return exercise.sets.reduce((total, set) => total + (parseFloat(set.weight) || 0) * (parseInt(set.reps) || 0), 0);
  };

  const calculateOverallTotalReps = () => {
    return exercises.reduce((total, exercise) => total + calculateTotalReps(exercise), 0);
  };

  const calculateOverallTotalWeight = () => {
    return exercises.reduce((total, exercise) => total + calculateTotalWeight(exercise), 0);
  };

  const handleSaveWorkout = () => {
    console.log('Saving workout:', { exercises, bodyweight, notes });
    toast({
      title: 'Workout Saved',
      description: 'Your workout has been saved successfully.'
    });
  };

  const handleDeleteWorkout = () => {
    setExercises([]);
    setBodyweight('');
    setNotes('');
    toast({
      title: 'Workout Deleted',
      description: 'Your workout has been deleted.'
    });
  };

  const handleShare = () => {
    toast({
      title: 'Share Workout',
      description: 'Sharing functionality to be implemented.'
    });
  };

  return (
    <div className="container mx-auto space-y-6 p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gym Workout</CardTitle>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">{new Date().toLocaleDateString()}</span>
            <Button variant="outline" size="icon" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[200px] justify-start">
                  {selectedExercise || 'Select exercise...'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search exercise..." />
                  <CommandEmpty>No exercise found.</CommandEmpty>
                  <CommandGroup>
                    {exerciseList.map((exercise) => (
                      <CommandItem
                        key={exercise}
                        value={exercise}
                        onSelect={(value) => {
                          setSelectedExercise(value);
                        }}
                      >
                        {exercise}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            <Button onClick={addExercise} disabled={!selectedExercise}>
              <Plus className="mr-2 h-4 w-4" />
              Add Exercise
            </Button>
          </div>
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Exercise</TableHead>
                  <TableHead className="text-right">Set 1</TableHead>
                  <TableHead className="text-right">Set 2</TableHead>
                  <TableHead className="text-right">Set 3</TableHead>
                  <TableHead className="text-right">Total Reps</TableHead>
                  <TableHead className="text-right">Total Weight</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exercises.map((exercise, index) => (
                  <TableRow key={exercise.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Input
                        value={exercise.name}
                        onChange={(e) => updateExercise(exercise.id, 'name', e.target.value)}
                      />
                    </TableCell>
                    {[0, 1, 2].map((setIndex) => (
                      <TableCell key={setIndex} className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Input
                            type="number"
                            value={exercise.sets[setIndex]?.weight || ''}
                            onChange={(e) => updateSet(exercise.id, setIndex, 'weight', e.target.value)}
                            className="w-16 text-right"
                            placeholder="kg"
                          />
                          <span>×</span>
                          <Input
                            type="number"
                            value={exercise.sets[setIndex]?.reps || ''}
                            onChange={(e) => updateSet(exercise.id, setIndex, 'reps', e.target.value)}
                            className="w-16 text-right"
                            placeholder="reps"
                          />
                        </div>
                      </TableCell>
                    ))}
                    <TableCell className="text-right">{calculateTotalReps(exercise)}</TableCell>
                    <TableCell className="text-right">{calculateTotalWeight(exercise).toFixed(1)} kg</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => removeExercise(exercise.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div>
            <p>Total Reps: {calculateOverallTotalReps()}</p>
            <p>Total Weight: {calculateOverallTotalWeight().toFixed(1)} kg</p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              if (exercises.length > 0) {
                addSet(exercises[exercises.length - 1].id);
              }
            }}
            disabled={exercises.length === 0}
          >
            Add Set
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bodyweight">Bodyweight (kg)</Label>
            <Input
              id="bodyweight"
              type="number"
              value={bodyweight}
              onChange={(e) => setBodyweight(e.target.value)}
              placeholder="Enter your bodyweight"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about your workout"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button onClick={handleSaveWorkout}>
          <Save className="mr-2 h-4 w-4" />
          Save Workout
        </Button>
        <Button variant="destructive" onClick={handleDeleteWorkout}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Workout
        </Button>
      </div>
    </div>
  );
}
