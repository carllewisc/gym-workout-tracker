interface Set {
  weight: string;
  reps: string;
}

interface Exercise {
  id: number;
  name: string;
  muscle: string;
  sets: Set[];
}

interface ApiExercise {
  _id: string;
  name: string;
  muscle: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}
