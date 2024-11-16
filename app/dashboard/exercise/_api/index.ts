export const fetchExercises = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/exercises`, {
    cache: 'no-store'
  });

  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
};

export const createExercise = async (exercise: any) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/exercises`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(exercise)
  });

  if (!response.ok) throw new Error('Failed to create exercise');
  return response.json();
};

export const updateExercise = async (_id: string, exercise: any) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/exercises/${_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(exercise)
  });

  if (!response.ok) throw new Error('Failed to update exercise');
  return response.json();
};

export const deleteExercise = async (id: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/exercises/${id}`, {
    method: 'DELETE'
  });

  if (!response.ok) throw new Error('Failed to delete exercise');
  return response.json();
};
