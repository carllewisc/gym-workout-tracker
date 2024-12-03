// @ts-nocheck
'use client';

import { useEffect, useState } from 'react';
import { Dumbbell } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { transformWorkoutData } from '@/app/mvp/(workout)/_utils';
import WorkoutStats from './workout-stats';

// TODO: move this
interface ExerciseEntry {
  weight: number;
  [key: string]: any;
}

// TODO: duplicate this type
interface Workout {
  _id: string;
  date: string;
  totalReps: number;
  totalWeight: number;
  exercises: { name: string; sets: { weight: number; reps: number }[] }[];
}

export default function ProgressOverviewByExercise({ workouts }: { workouts: Workout[] }) {
  const [progressData, setProgressData] = useState({});
  const [exercises, setExercises] = useState(Object.keys(progressData));
  const [selectedExercise, setSelectedExercise] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const transformedData = transformWorkoutData(workouts);
    const exercises = Object.keys(transformedData);
    setExercises(exercises);
    setProgressData(transformedData);
    setSelectedExercise(exercises[0]);
  }, [workouts]);

  const handleExerciseChange = (exercise: string) => {
    setIsLoading(true);
    setSelectedExercise(exercise);
    setTimeout(() => setIsLoading(false), 1000);
  };

  if (!selectedExercise) {
    return null;
  }

  const data = progressData[selectedExercise].map((entry: ExerciseEntry, index: number, array: ExerciseEntry[]) => ({
    ...entry,
    percentageChange:
      index > 0 ? (((entry.weight - array[index - 1].weight) / array[index - 1].weight) * 100).toFixed(2) : '0.00'
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="rounded border bg-background p-4 shadow-lg">
          <p className="font-bold">{new Date(label).toLocaleDateString()}</p>
          <p>Weight: {dataPoint.weight.toFixed(1)} kg</p>
          <p>Reps: {dataPoint.reps}</p>
          <p>Change: {dataPoint.percentageChange}%</p>
        </div>
      );
    }
    return null;
  };

  const statsData = progressData[selectedExercise];
  const stats = {
    startingWeight: statsData[0].weight,
    currentWeight: statsData[statsData.length - 1].weight,
    improvement: statsData[statsData.length - 1].weight - statsData[0].weight,
    bestSession: Math.max(...statsData.map((d) => d.weight))
  };

  return (
    <>
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">Progress Overview</CardTitle>
          <Select value={selectedExercise} onValueChange={handleExerciseChange}>
            <SelectTrigger className="w-[180px]">
              <Dumbbell className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select exercise" />
            </SelectTrigger>
            <SelectContent>
              {exercises.map((exercise) => (
                <SelectItem key={exercise} value={exercise}>
                  {exercise}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex h-[400px] items-center justify-center">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : data.length === 0 ? (
            <div className="flex h-[400px] items-center justify-center text-muted-foreground">
              No data available for this exercise
            </div>
          ) : (
            <div className="h-[400px] w-full" style={{ aspectRatio: '16/9' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => new Date(date).toLocaleDateString()}
                    stroke="currentColor"
                    fontSize={12}
                  />
                  <YAxis
                    label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft' }}
                    domain={['dataMin - 5', 'dataMax + 5']}
                    stroke="currentColor"
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#A47E3B"
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#E5BA73' }}
                    activeDot={{ r: 8, fill: '#E5BA73' }}
                    animationDuration={300}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
      <WorkoutStats stats={stats} />
    </>
  );
}
