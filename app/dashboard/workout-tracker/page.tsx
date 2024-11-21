// @ts-nocheck
'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

import { Play, Pause, CircleStopIcon as Stop, Plus, X, Clock } from 'lucide-react';
import ExerciseSetTracker from './ExerciseSetTracker';
import ExerciseSelection from './ExerciseSelection';
import ExerciseDetailsModal from './ExerciseDetailsModal';

// Mock data for exercises
const exerciseData = {
  Chest: ['Bench Press', 'Incline Press', 'Chest Flyes'],
  Back: ['Pull-ups', 'Rows', 'Lat Pulldowns'],
  Legs: ['Squats', 'Deadlifts', 'Leg Press'],
  Shoulders: ['Overhead Press', 'Lateral Raises', 'Front Raises'],
  Arms: ['Bicep Curls', 'Tricep Extensions', 'Hammer Curls'],
  Core: ['Crunches', 'Planks', 'Russian Twists']
};

type Exercise = {
  id: string;
  name: string;
  sets: { weight: number; reps: number }[];
};

type WorkoutState = 'notStarted' | 'inProgress' | 'paused' | 'completed';

const WorkoutTracker = () => {
  const [workoutState, setWorkoutState] = useState<WorkoutState>('notStarted');
  const [duration, setDuration] = useState(0);
  const [notes, setNotes] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [isMetric, setIsMetric] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const { toast } = useToast();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (workoutState === 'inProgress') {
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [workoutState]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  };

  const handleStartWorkout = () => {
    setWorkoutState('inProgress');
  };

  const handlePauseWorkout = () => {
    setWorkoutState('paused');
  };

  const handleEndWorkout = () => {
    setWorkoutState('completed');
    toast({
      title: 'Workout Completed',
      description: `Total duration: ${formatDuration(duration)}`
    });
  };

  const handleAddExercise = () => {
    if (selectedExercise) {
      setExercises((prev) => [
        ...prev,
        { id: Date.now().toString(), name: selectedExercise, sets: [{ weight: 0, reps: 0 }] }
      ]);
      setSelectedExercise(null);
    }
  };

  const handleAddSet = (exerciseId: string) => {
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: [...ex.sets, { weight: ex.sets[ex.sets.length - 1].weight, reps: ex.sets[ex.sets.length - 1].reps }]
            }
          : ex
      )
    );
  };

  const handleUpdateSet = (exerciseId: string, setIndex: number, field: 'weight' | 'reps', value: number) => {
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === exerciseId
          ? { ...ex, sets: ex.sets.map((set, idx) => (idx === setIndex ? { ...set, [field]: value } : set)) }
          : ex
      )
    );
  };

  const handleRemoveExercise = (exerciseId: string) => {
    setExercises((prev) => prev.filter((ex) => ex.id !== exerciseId));
  };

  return (
    <div className="container mx-auto max-w-3xl p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-2xl font-bold">
            <span>New Workout - {new Date().toLocaleDateString()}</span>
            {isOffline && <span className="text-sm font-normal text-yellow-500">Offline Mode</span>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center justify-between">
            <div className="space-x-2">
              {workoutState === 'notStarted' && (
                <Button onClick={handleStartWorkout}>
                  <Play className="mr-2 h-4 w-4" /> Start
                </Button>
              )}
              {workoutState === 'inProgress' && (
                <>
                  <Button onClick={handlePauseWorkout}>
                    <Pause className="mr-2 h-4 w-4" /> Pause
                  </Button>
                  <Button onClick={handleEndWorkout} variant="destructive">
                    <Stop className="mr-2 h-4 w-4" /> End
                  </Button>
                </>
              )}
              {workoutState === 'paused' && (
                <>
                  <Button onClick={handleStartWorkout}>
                    <Play className="mr-2 h-4 w-4" /> Resume
                  </Button>
                  <Button onClick={handleEndWorkout} variant="destructive">
                    <Stop className="mr-2 h-4 w-4" /> End
                  </Button>
                </>
              )}
            </div>
            <div className="text-2xl font-bold">{formatDuration(duration)}</div>
          </div>
          <Textarea
            placeholder="Workout notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mb-4"
          />
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add Exercise</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex space-x-2">
            <Select value={selectedMuscleGroup || ''} onValueChange={setSelectedMuscleGroup}>
              <SelectTrigger>
                <SelectValue placeholder="Select Muscle Group" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(exerciseData).map((group) => (
                  <SelectItem key={group} value={group}>
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedExercise || ''} onValueChange={setSelectedExercise} disabled={!selectedMuscleGroup}>
              <SelectTrigger>
                <SelectValue placeholder="Select Exercise" />
              </SelectTrigger>
              <SelectContent>
                {selectedMuscleGroup &&
                  exerciseData[selectedMuscleGroup].map((exercise) => (
                    <SelectItem key={exercise} value={exercise}>
                      {exercise}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAddExercise} disabled={!selectedExercise}>
              <Plus className="mr-2 h-4 w-4" /> Add
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="unit-toggle" checked={isMetric} onCheckedChange={setIsMetric} />
            <Label htmlFor="unit-toggle">{isMetric ? 'Metric (kg)' : 'Imperial (lbs)'}</Label>
          </div>
        </CardContent>
      </Card>

      {exercises.map((exercise, index) => (
        <Card key={exercise.id} className="mb-4">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{exercise.name}</span>
              <Button variant="ghost" size="icon" onClick={() => handleRemoveExercise(exercise.id)}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {exercise.sets.map((set, setIndex) => (
              <div key={setIndex} className="mb-2 flex items-center space-x-2">
                <span className="w-16">Set {setIndex + 1}</span>
                <Input
                  type="number"
                  value={set.weight}
                  onChange={(e) => handleUpdateSet(exercise.id, setIndex, 'weight', Number(e.target.value))}
                  className="w-20"
                  placeholder={isMetric ? 'kg' : 'lbs'}
                />
                <Input
                  type="number"
                  value={set.reps}
                  onChange={(e) => handleUpdateSet(exercise.id, setIndex, 'reps', Number(e.target.value))}
                  className="w-20"
                  placeholder="Reps"
                />
                <Button variant="outline" size="icon">
                  <Clock className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" onClick={() => handleAddSet(exercise.id)} className="mt-2">
              <Plus className="mr-2 h-4 w-4" /> Add Set
            </Button>
          </CardContent>
        </Card>
      ))}
      <ExerciseSetTracker />
      <ExerciseSelection />
      <ExerciseDetailsModal />
    </div>
  );
};

export default WorkoutTracker;
