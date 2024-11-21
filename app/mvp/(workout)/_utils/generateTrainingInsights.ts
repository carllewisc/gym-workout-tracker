interface Workout {
  date: string;
  exercises: Array<{
    name: string;
    sets: Array<{
      weight: number;
      reps: number;
    }>;
  }>;
  totalWeight: number;
}

interface TrainingInsights {
  mostConsistentDay: {
    day: string;
    sessionsCount: number;
  };
  volumeTrend: {
    percentage: number;
    direction: 'up' | 'down';
  };
  restPattern: {
    averageDays: number;
  };
  focusAreas: {
    muscleGroup: string;
    sessions: number;
  };
}

export function generateTrainingInsights(workouts: Workout[]): TrainingInsights | null {
  if (!workouts.length) return null;

  const sortedWorkouts = [...workouts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Filtrar workouts por mes
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const thisMonthWorkouts = sortedWorkouts.filter((workout) => {
    const workoutDate = new Date(workout.date);
    return workoutDate.getMonth() === currentMonth && workoutDate.getFullYear() === currentYear;
  });

  const lastMonthWorkouts = sortedWorkouts.filter((workout) => {
    const workoutDate = new Date(workout.date);
    return workoutDate.getMonth() === currentMonth - 1 && workoutDate.getFullYear() === currentYear;
  });

  // 1. Día más consistente
  const workoutsByDay = thisMonthWorkouts.reduce(
    (acc, workout) => {
      const day = new Date(workout.date).toLocaleDateString('en-US', { weekday: 'long' });
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const [mostConsistentDay, sessionsCount] = Object.entries(workoutsByDay).sort(([, a], [, b]) => b - a)[0] || [
    'Monday',
    0
  ];

  // 2. Tendencia de volumen
  const thisMonthVolume = thisMonthWorkouts.reduce((sum, workout) => sum + workout.totalWeight, 0);
  const lastMonthVolume = lastMonthWorkouts.reduce((sum, workout) => sum + workout.totalWeight, 0);

  const volumeChange = lastMonthVolume ? Math.round(((thisMonthVolume - lastMonthVolume) / lastMonthVolume) * 100) : 0;

  // 3. Patrón de descanso
  const restDays = sortedWorkouts.slice(0, -1).map((workout, index) => {
    const current = new Date(workout.date);
    const next = new Date(sortedWorkouts[index + 1].date);
    return Math.abs((current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24));
  });

  const averageRestDays = Math.round((restDays.reduce((sum, days) => sum + days, 0) / restDays.length) * 10) / 10;

  // 4. Área de enfoque
  const exerciseCount = thisMonthWorkouts.reduce(
    (acc, workout) => {
      workout.exercises.forEach((exercise) => {
        const category = categorizeExercise(exercise.name);
        acc[category] = (acc[category] || 0) + 1;
      });
      return acc;
    },
    {} as Record<string, number>
  );

  const [focusArea, sessionCount] = Object.entries(exerciseCount).sort(([, a], [, b]) => b - a)[0] || ['Legs', 0];

  return {
    mostConsistentDay: {
      day: mostConsistentDay,
      sessionsCount: thisMonthWorkouts.length
    },
    volumeTrend: {
      percentage: Math.abs(volumeChange),
      direction: volumeChange >= 0 ? 'up' : 'down'
    },
    restPattern: {
      averageDays: averageRestDays
    },
    focusAreas: {
      muscleGroup: focusArea,
      sessions: sessionCount
    }
  };
}

function categorizeExercise(exerciseName: string): string {
  const categories = {
    Legs: ['Squat', 'Leg Press', 'Leg Extensions', 'Calf Raises'],
    Push: ['Bench Press', 'Overhead Press', 'Dips'],
    Pull: ['Deadlift', 'Pull-ups', 'Barbell Row', 'Bicep Curls']
  };

  for (const [category, exercises] of Object.entries(categories)) {
    if (exercises.some((exercise) => exerciseName.includes(exercise))) {
      return category;
    }
  }

  return 'Other';
}
