// @ts-nocheck
'use client';

import * as React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import ProgressOverviewByExercise from './_components/progress-overview-by-exercise';
import WorkoutStats from './_components/workout-stats';
import WorkoutList from './_components/workout-list';
import TrainingInsights from './_components/training-insights';
import TrainingCalendar from './_components/training-calendar';
import PersonalRecords from './_components/personal-records';
import MuscleGroupVolume from './_components/muscle-group-volume';
import WorkoutAllStats from './_components/workout-analytics';
import WorkoutDashboard from './_components/workout-dashboard';

import { useEffect } from 'react';
import { fetchWorkouts } from '@/app/mvp/(workout)/_api';
import PageContainer from '@/components/layout/page-container';
import { generateTrainingInsights } from '@/app/mvp/(workout)/_utils/generateTrainingInsights';
import { generatePersonalRecords } from '@/app/mvp/(workout)/_utils/generatePersonalRecords';

const progressData = [
  { date: '2023-04-30', weight: 95, reps: 5, notes: 'First session' },
  { date: '2023-05-07', weight: 103, reps: 5 },
  { date: '2023-05-14', weight: 110, reps: 5, notes: 'PR attempt' },
  { date: '2023-05-21', weight: 110, reps: 6 },
  { date: '2023-05-28', weight: 115, reps: 5 },
  { date: '2023-06-04', weight: 115, reps: 5 },
  { date: '2023-06-11', weight: 125, reps: 4, notes: 'New PR!' }
];

export default function WorkoutAnalytics() {
  const [dateRange, setDateRange] = React.useState('6m');

  const stats = {
    startingWeight: progressData[0].weight,
    currentWeight: progressData[progressData.length - 1].weight,
    improvement: progressData[progressData.length - 1].weight - progressData[0].weight,
    bestSession: Math.max(...progressData.map((d) => d.weight))
  };
  const [workouts, setWorkouts] = React.useState([]);

  useEffect(() => {
    fetchWorkouts()
      .then((data) => {
        setWorkouts(data.workouts);
      })
      .catch((error) => {
        console.error('Error fetching workouts:', error);
      });
  }, []);

  const insights = generateTrainingInsights(workouts);
  const personalRecords = generatePersonalRecords(workouts);

  return (
    <PageContainer scrollable>
      <div className="container mx-auto space-y-6 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Workout Analytics</h1>
          <Select defaultValue={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">Last month</SelectItem>
              <SelectItem value="3m">Last 3 months</SelectItem>
              <SelectItem value="6m">Last 6 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
            <TabsTrigger value="training-insights">Training Insights</TabsTrigger>
            <TabsTrigger value="training-calendar">Training Calendar</TabsTrigger>
            <TabsTrigger value="personal-records">Personal Records</TabsTrigger>
            <TabsTrigger value="workout-dashboard">WorkoutDashboard</TabsTrigger>
            <TabsTrigger value="volume-by-muscle-group">Volume by Muscle Group</TabsTrigger>
            <TabsTrigger value="volume" disabled className="text-muted-foreground">
              Volume Analysis (Coming Soon)
            </TabsTrigger>
            <TabsTrigger value="performance" disabled className="text-muted-foreground">
              Performance (Coming Soon)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <WorkoutAllStats workouts={workouts} />
              <WorkoutList workouts={workouts} />
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-4">
            <ProgressOverviewByExercise workouts={workouts} />
            <WorkoutStats stats={stats} />
          </TabsContent>

          <TabsContent value="training-insights">
            <TrainingInsights insights={insights} />
          </TabsContent>

          <TabsContent value="training-calendar">
            <TrainingCalendar />
          </TabsContent>

          <TabsContent value="personal-records">
            <PersonalRecords personalRecords={personalRecords} />
          </TabsContent>
          <TabsContent value="volume-by-muscle-group">
            <MuscleGroupVolume />
          </TabsContent>
          <TabsContent value="workout-dashboard">
            <WorkoutDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
