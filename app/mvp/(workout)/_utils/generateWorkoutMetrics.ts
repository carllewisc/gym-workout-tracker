interface Workout {
  exercises: Array<{
    name: string;
    sets: Array<{
      weight: number;
      reps: number;
    }>;
  }>;
  totalWeight: number;
  date: string;
}

interface WorkoutMetrics {
  totalWeight: {
    value: string;
    change: number;
  };
  workoutsCompleted: {
    value: string;
    change: number;
  };
  currentStreak: {
    value: string;
  };
  personalBest: {
    value: string;
    subtitle: string;
  };
}

function generateWorkoutMetrics(workouts: Workout[], dateRange: '7d' | '30d' | '3m'): WorkoutMetrics {
  const now = new Date();
  const ranges = {
    '7d': 7,
    '30d': 30,
    '3m': 90
  };

  const daysInRange = ranges[dateRange];
  const rangeStart = new Date(now.getTime() - (daysInRange * 24 * 60 * 60 * 1000));
  const previousRangeStart = new Date(rangeStart.getTime() - (daysInRange * 24 * 60 * 60 * 1000));

  // Filtrar workouts por periodo actual y anterior
  const currentPeriodWorkouts = workouts.filter(w => new Date(w.date) >= rangeStart);
  const previousPeriodWorkouts = workouts.filter(w =>
    new Date(w.date) >= previousRangeStart && new Date(w.date) < rangeStart
  );

  // 1. Total Weight Lifted
  const currentTotalWeight = currentPeriodWorkouts.reduce((sum, w) => sum + w.totalWeight, 0);
  const previousTotalWeight = previousPeriodWorkouts.reduce((sum, w) => sum + w.totalWeight, 0);
  const weightChange = previousTotalWeight > 0
    ? ((currentTotalWeight - previousTotalWeight) / previousTotalWeight) * 100
    : 0;

  // 2. Workouts Completed
  const currentWorkouts = currentPeriodWorkouts.length;
  const previousWorkouts = previousPeriodWorkouts.length;
  const workoutsChange = previousWorkouts > 0
    ? ((currentWorkouts - previousWorkouts) / previousWorkouts) * 100
    : 0;

  // 3. Current Streak
  let currentStreak = 0;
  const sortedWorkouts = [...workouts].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  for (let i = 0; i < sortedWorkouts.length - 1; i++) {
    const currentDate = new Date(sortedWorkouts[i].date);
    const nextDate = new Date(sortedWorkouts[i + 1].date);
    const diffDays = Math.floor((currentDate.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays > 1) break;
    currentStreak++;
  }
  currentStreak++; // Add one for the most recent workout

  // 4. Personal Best
  let personalBest = {
    weight: 0,
    exercise: ''
  };

  workouts.forEach(workout => {
    workout.exercises.forEach(exercise => {
      const maxWeight = Math.max(...exercise.sets.map(set => set.weight));
      if (maxWeight > personalBest.weight) {
        personalBest = {
          weight: maxWeight,
          exercise: exercise.name
        };
      }
    });
  });

  return {
    totalWeight: {
      value: `${currentTotalWeight.toLocaleString()} kg`,
      change: Number(weightChange.toFixed(1))
    },
    workoutsCompleted: {
      value: currentWorkouts.toString(),
      change: Number(workoutsChange.toFixed(1))
    },
    currentStreak: {
      value: `${currentStreak} days`
    },
    personalBest: {
      value: `${personalBest.weight} kg`,
      subtitle: personalBest.exercise
    }
  };
}

export { generateWorkoutMetrics };