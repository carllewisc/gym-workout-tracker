'use client';

import * as React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ExerciseManagement from './_components/exercise-management';
import ExerciseManagement2 from './_components/exercise-management-2';
// import WorkoutAllStats from './_components/workout-all-stats';
// import WorkoutList from './_components/workout-list';
import { useEffect } from 'react';
import { fetchWorkouts } from '@/app/mvp/(workout)/_api';
import PageContainer from '@/components/layout/page-container';

export default function WorkoutAnalytics() {
  const [dateRange, setDateRange] = React.useState('6m');
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
            <TabsTrigger value="exercise-management">Exercise Management</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              {/*<WorkoutAllStats workouts={workouts} />*/}
              <ExerciseManagement workouts={workouts} />
            </Card>
          </TabsContent>
          <TabsContent value="exercise-management">
            <Card>
              <ExerciseManagement2 />
            </Card>
          </TabsContent>

          {/* Add more TabsContent here as needed */}
        </Tabs>
      </div>
    </PageContainer>
  );
}
