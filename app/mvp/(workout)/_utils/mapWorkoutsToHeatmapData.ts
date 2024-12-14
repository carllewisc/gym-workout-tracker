import { format } from 'date-fns';

type Exercise = {
  name: string;
  sets: Array<{
    weight: number;
    reps: number;
  }>;
};

type APIWorkout = {
  _id: string;
  exercises: Exercise[];
  totalReps: number;
  totalWeight: number;
  bodyweight: number | null;
  notes: string;
  date: string;
};

type WorkoutData = {
  exercises: number;
  volume: number;
  type: string;
  intensity: number;
};

type HeatmapData = Record<string, WorkoutData[]>;

export const calculateWorkoutIntensity = (workout: APIWorkout): number => {
  if (!workout.exercises.length) return 0;

  // Calculate average weight per rep
  const avgWeightPerRep = workout.totalWeight / workout.totalReps;

  // Assuming max weight per rep is 200kg for normalization
  // You can adjust this based on your users' typical ranges
  const maxWeightPerRep = 200;

  // Normalize to 0-1 range
  return Math.min(avgWeightPerRep / maxWeightPerRep, 1);
};

export const determineWorkoutType = (exercises: Exercise[]): string => {
  const exerciseNames = exercises.map((ex) => ex.name.toLowerCase());

  // Define exercise categories
  const pushExercises = ['bench press', 'overhead press', 'dips'];
  const pullExercises = ['deadlift', 'pull-ups', 'barbell row'];
  const legExercises = ['squat', 'leg press', 'leg extensions', 'calf raises'];

  // Count exercises in each category
  const pushCount = exerciseNames.filter((name) => pushExercises.includes(name)).length;
  const pullCount = exerciseNames.filter((name) => pullExercises.includes(name)).length;
  const legCount = exerciseNames.filter((name) => legExercises.includes(name)).length;

  // Determine primary type
  if (legCount >= Math.max(pushCount, pullCount)) return 'Legs';
  if (pushCount >= pullCount) return 'Push';
  if (pullCount > pushCount) return 'Pull';

  return 'Other';
};

export const mapWorkoutsToHeatmapData = (workouts: APIWorkout[]): HeatmapData => {
  const heatmapData: HeatmapData = {};

  workouts.forEach((workout) => {
    const dateKey = format(new Date(workout.date), 'yyyy-MM-dd');

    const workoutData: WorkoutData = {
      exercises: workout.exercises.length,
      volume: workout.totalWeight,
      type: determineWorkoutType(workout.exercises),
      intensity: calculateWorkoutIntensity(workout)
    };

    if (!heatmapData[dateKey]) {
      heatmapData[dateKey] = [];
    }

    heatmapData[dateKey].push(workoutData);
  });

  return heatmapData;
};
