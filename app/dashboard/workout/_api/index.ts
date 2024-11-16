export const fetchWorkouts = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/workouts`,
    {
      cache: 'no-store'
    }
  );

  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
};

export const fetchWorkoutById = async (id: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/workouts/${id}`,
    {
      cache: 'no-store'
    }
  );

  if (!response.ok) throw new Error('Failed to fetch workout');
  return response.json();
};
