interface WorkoutSet {
  weight: number;
  reps: number;
}

interface Exercise {
  name: string;
  sets: WorkoutSet[];
}

interface Workout {
  exercises: Exercise[];
  date: string;
}

interface PersonalRecord {
  id: number;
  exercise: string;
  weight: number;
  previousRecord: number;
  date: string;
  history: Array<{ weight: number; date: string }>;
}

function generatePersonalRecords(workouts: Workout[]): PersonalRecord[] {
  const exerciseData = new Map<string, Array<{ weight: number; date: string }>>();

  // 1. Collect all records
  workouts.forEach(workout => {
    workout.exercises.forEach(exercise => {
      const maxWeight = Math.max(...exercise.sets.map(set => set.weight));

      const key = exercise.name;
      if (!exerciseData.has(key)) {
        exerciseData.set(key, []);
      }

      // Save each record without any filter
      exerciseData.get(key)!.push({
        weight: maxWeight,
        date: workout.date
      });
    });
  });

  // 2. Process each exercise
  return Array.from(exerciseData.entries()).map(([exercise, records], index) => {
    // Sort only by date, most recent first
    const sortedByDate = [...records].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // The current PR is the most recent record
    const currentRecord = sortedByDate[0];

    // Sort the rest by weight to find the previous record
    const sortedByWeight = sortedByDate
      .slice(1) // Exclude the current PR
      .sort((a, b) => b.weight - a.weight);

    const previousRecord = sortedByWeight[0] || currentRecord;

    return {
      id: index + 1,
      exercise,
      weight: currentRecord.weight,
      previousRecord: previousRecord.weight,
      date: currentRecord.date,
      // Include all records in history
      history: sortedByDate.map(({ weight, date }) => ({
        weight,
        date
      }))
    };
  });
}

export { generatePersonalRecords };