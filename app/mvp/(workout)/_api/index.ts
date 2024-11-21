import { apiClient } from '@/lib/api-client';
import axios from 'axios';

export const fetchWorkouts = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/workouts?limit=1000`, {
    cache: 'no-store'
  });

  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
};

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

export const deleteWorkout = async (id: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/workouts/${id}`, {
    method: 'DELETE'
  });

  if (!response.ok) throw new Error('Failed to delete workout');
  return response.json();
};

export const fetchExercises = async ({
  page = 1,
  limit = 10,
  search = '',
  muscle = ''
}: {
  page?: number;
  limit?: number;
  search?: string;
  muscle?: string;
} = {}) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(muscle && { muscle })
    });

    const { data } = await apiClient.get(`/api/exercises?${params}`);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to fetch exercises');
    }
    throw error;
  }
};

export const fetchAllExercises = async () => {
  try {
    // TODO: hardcode limit for now
    const { data } = await apiClient.get('/api/exercises?limit=1000');
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to fetch exercises');
    }
    throw error;
  }
};
