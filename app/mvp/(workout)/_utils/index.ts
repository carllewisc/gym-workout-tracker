interface ExerciseSet {
  weight: number;
  reps: number;
  _id: { $oid: string };
}

interface Exercise {
  name: string;
  sets: ExerciseSet[];
  _id: { $oid: string };
}

interface WorkoutSession {
  _id: { $oid: string };
  exercises: Exercise[];
  totalReps: number;
  totalWeight: number;
  bodyweight: number;
  notes: string;
  image: null;
  date: { $date: string };
  createdAt: { $date: string };
  updatedAt: { $date: string };
}

interface TransformedDataPoint {
  date: string;
  weight: number;
  reps: number;
}

interface ProgressData {
  [key: string]: TransformedDataPoint[];
}

function transformWorkoutData(workoutSessions: WorkoutSession[]): ProgressData {
  const progressData: ProgressData = {};

  // Ordenar las sesiones por fecha
  const sortedSessions = workoutSessions.sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Procesar cada sesión
  sortedSessions.forEach(session => {
    // Procesar cada ejercicio en la sesión
    session.exercises.forEach(exercise => {
      if (!progressData[exercise.name]) {
        progressData[exercise.name] = [];
      }

      // Encontrar el set con el mayor peso y sus repeticiones
      const maxWeightSet = exercise.sets.reduce((max, current) => {
        return current.weight > max.weight ? current : max;
      }, exercise.sets[0]);

      // Agregar el punto de datos para este ejercicio
      progressData[exercise.name].push({
        date: session.date,
        weight: maxWeightSet.weight,
        reps: maxWeightSet.reps
      });
    });
  });

  return progressData;
}

export { transformWorkoutData };