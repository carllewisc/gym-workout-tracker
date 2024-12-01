// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Plus, Trash2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: number;
  rest: number;
  notes: string;
};

type WorkoutDay = {
  date: Date;
  exercises: Exercise[];
};

export default function BasicTrainingPlanCreator() {
  const { toast } = useToast();
  const [planName, setPlanName] = useState('');
  const [description, setDescription] = useState('');
  const [weeks, setWeeks] = useState<string>('4');
  const [difficulty, setDifficulty] = useState<string>('beginner');
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>([]);

  const handleDateSelect = (date: Date) => {
    setSelectedDates((prev) => {
      const isSelected = prev.some((d) => d.toDateString() === date.toDateString());
      if (isSelected) {
        return prev.filter((d) => d.toDateString() !== date.toDateString());
      } else {
        return [...prev, date];
      }
    });

    setWorkoutDays((prev) => {
      const existingDay = prev.find((d) => d.date.toDateString() === date.toDateString());
      if (existingDay) {
        return prev.filter((d) => d.date.toDateString() !== date.toDateString());
      } else {
        return [...prev, { date, exercises: [] }];
      }
    });
  };

  const addExercise = (date: Date) => {
    setWorkoutDays((prev) => {
      const dayIndex = prev.findIndex((d) => d.date.toDateString() === date.toDateString());
      if (dayIndex === -1) return prev;

      const newExercise: Exercise = {
        id: `exercise-${Date.now()}`,
        name: '',
        sets: 3,
        reps: 10,
        rest: 60,
        notes: ''
      };

      const updatedDay = {
        ...prev[dayIndex],
        exercises: [...prev[dayIndex].exercises, newExercise]
      };

      return [...prev.slice(0, dayIndex), updatedDay, ...prev.slice(dayIndex + 1)];
    });
  };

  const updateExercise = (date: Date, exerciseId: string, field: keyof Exercise, value: string | number) => {
    setWorkoutDays((prev) => {
      const dayIndex = prev.findIndex((d) => d.date.toDateString() === date.toDateString());
      if (dayIndex === -1) return prev;

      const exerciseIndex = prev[dayIndex].exercises.findIndex((e) => e.id === exerciseId);
      if (exerciseIndex === -1) return prev;

      const updatedExercises = [...prev[dayIndex].exercises];
      updatedExercises[exerciseIndex] = {
        ...updatedExercises[exerciseIndex],
        [field]: value
      };

      return [
        ...prev.slice(0, dayIndex),
        { ...prev[dayIndex], exercises: updatedExercises },
        ...prev.slice(dayIndex + 1)
      ];
    });
  };

  const removeExercise = (date: Date, exerciseId: string) => {
    setWorkoutDays((prev) => {
      const dayIndex = prev.findIndex((d) => d.date.toDateString() === date.toDateString());
      if (dayIndex === -1) return prev;

      const updatedExercises = prev[dayIndex].exercises.filter((e) => e.id !== exerciseId);

      return [
        ...prev.slice(0, dayIndex),
        { ...prev[dayIndex], exercises: updatedExercises },
        ...prev.slice(dayIndex + 1)
      ];
    });
  };

  const handleSaveDraft = () => {
    // Here you would typically send the data to your backend
    console.log({
      planName,
      description,
      weeks,
      difficulty,
      workoutDays
    });

    toast({
      title: 'Draft Saved',
      description: 'Your training plan draft has been saved.'
    });
  };

  return (
    <div className="container mx-auto space-y-6 p-4">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Create Training Plan</h1>
        <Button onClick={handleSaveDraft}>
          <Save className="mr-2 h-4 w-4" />
          Save Draft
        </Button>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="plan-name">Plan Name</Label>
            <Input
              id="plan-name"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              placeholder="Enter plan name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter plan description"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weeks">Duration (Weeks)</Label>
              <Select value={weeks} onValueChange={setWeeks}>
                <SelectTrigger id="weeks">
                  <SelectValue placeholder="Select weeks" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4">4 Weeks</SelectItem>
                  <SelectItem value="8">8 Weeks</SelectItem>
                  <SelectItem value="12">12 Weeks</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty Level</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger id="difficulty">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Training Days</CardTitle>
        </CardHeader>
        <CardContent>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'w-[280px] justify-start text-left font-normal',
                  !selectedDates && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDates.length > 0 ? `${selectedDates.length} days selected` : 'Select training days'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="multiple"
                selected={selectedDates}
                onSelect={handleDateSelect}
                className="rounded-md border"
              />
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>

      {workoutDays.map((day) => (
        <Card key={day.date.toISOString()}>
          <CardHeader>
            <CardTitle>{format(day.date, 'EEEE, MMMM d, yyyy')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {day.exercises.map((exercise) => (
              <div key={exercise.id} className="space-y-2 rounded-md border p-4">
                <div className="flex items-center justify-between">
                  <Input
                    value={exercise.name}
                    onChange={(e) => updateExercise(day.date, exercise.id, 'name', e.target.value)}
                    placeholder="Exercise name"
                    className="mr-2 w-full"
                  />
                  <Button variant="ghost" size="icon" onClick={() => removeExercise(day.date, exercise.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label htmlFor={`sets-${exercise.id}`}>Sets</Label>
                    <Input
                      id={`sets-${exercise.id}`}
                      type="number"
                      value={exercise.sets}
                      onChange={(e) => updateExercise(day.date, exercise.id, 'sets', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`reps-${exercise.id}`}>Reps</Label>
                    <Input
                      id={`reps-${exercise.id}`}
                      type="number"
                      value={exercise.reps}
                      onChange={(e) => updateExercise(day.date, exercise.id, 'reps', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`rest-${exercise.id}`}>Rest (sec)</Label>
                    <Input
                      id={`rest-${exercise.id}`}
                      type="number"
                      value={exercise.rest}
                      onChange={(e) => updateExercise(day.date, exercise.id, 'rest', parseInt(e.target.value))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor={`notes-${exercise.id}`}>Notes</Label>
                  <Textarea
                    id={`notes-${exercise.id}`}
                    value={exercise.notes}
                    onChange={(e) => updateExercise(day.date, exercise.id, 'notes', e.target.value)}
                    placeholder="Additional notes"
                  />
                </div>
              </div>
            ))}
            <Button onClick={() => addExercise(day.date)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Exercise
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
