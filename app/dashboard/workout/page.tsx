import React from 'react';
import WorkoutListingPage from './_components/workout-listing-page';
import { fetchWorkouts } from '@/app/dashboard/workout/_api';

export const metadata = {
  title: 'Dashboard : Workouts'
};

export default async function Page() {
  const data = await fetchWorkouts();

  return <WorkoutListingPage workouts={data?.workouts ?? []} />;
}
