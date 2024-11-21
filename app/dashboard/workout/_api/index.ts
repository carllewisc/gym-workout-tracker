export const fetchWorkoutById = async (id: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/workouts/${id}`, {
    cache: 'no-store'
  });

  if (!response.ok) throw new Error('Failed to fetch workout');
  return response.json();
};

export const createWorkout = async (workout: any) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/workouts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(workout)
  });

  if (!response.ok) throw new Error('Failed to create workout');
  return response.json();
};
