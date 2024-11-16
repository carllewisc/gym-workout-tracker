import mongoose, { Schema, Document } from 'mongoose';

// Interfaces
export interface ISet extends Document {
  weight: number;
  reps: number;
}

export interface IExercise extends Document {
  name: string;
  sets: ISet[];
}

export interface IWorkout extends Document {
  date: Date;
  exercises: IExercise[];
  totalReps: number;
  totalWeight: number;
  bodyweight?: number;
  notes?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schemas
const SetSchema: Schema = new Schema({
  weight: {
    type: Number,
    required: [true, 'Weight is required'],
    min: [0, 'Weight cannot be negative']
  },
  reps: {
    type: Number,
    required: [true, 'Reps is required'],
    min: [0, 'Reps cannot be negative']
  }
});

const ExerciseSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Exercise name is required'],
    trim: true
  },
  sets: {
    type: [SetSchema],
    required: [true, 'Sets are required'],
    validate: {
      validator: function (sets: ISet[]) {
        return sets.length > 0;
      },
      message: 'At least one set is required'
    }
  }
});

const WorkoutSchema: Schema = new Schema(
  {
    date: {
      type: Date,
      default: Date.now
    },
    exercises: {
      type: [ExerciseSchema],
      required: [true, 'Exercises are required'],
      validate: {
        validator: function (exercises: IExercise[]) {
          return exercises.length > 0;
        },
        message: 'At least one exercise is required'
      }
    },
    totalReps: {
      type: Number,
      default: 0
    },
    totalWeight: {
      type: Number,
      default: 0
    },
    bodyweight: {
      type: Number,
      min: [0, 'Bodyweight cannot be negative'],
      default: null
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot be longer than 1000 characters'],
      default: ''
    },
    image: {
      type: String,
      trim: true,
      default: null,
      validate: {
        validator: function (v: string | null) {
          if (!v) return true;
          return /^https?:\/\/.*/.test(v) || /^\/uploads\/.*/.test(v);
        },
        message: 'Invalid image URL format'
      }
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

WorkoutSchema.pre<IWorkout>('save', function (next) {
  let totalReps = 0;
  let totalWeight = 0;

  this.exercises.forEach((exercise) => {
    exercise.sets.forEach((set) => {
      totalReps += set.reps;
      totalWeight += set.weight * set.reps;
    });
  });

  this.totalReps = totalReps;
  this.totalWeight = totalWeight;
  next();
});

WorkoutSchema.methods.getExerciseVolume = function (
  this: IWorkout,
  exerciseName: string
): number {
  const exercise = this.exercises.find((e) => e.name === exerciseName);
  if (!exercise) return 0;

  return exercise.sets.reduce((total, set) => total + set.weight * set.reps, 0);
};

const Workout =
  mongoose.models.Workout || mongoose.model<IWorkout>('Workout', WorkoutSchema);

export { Workout };
