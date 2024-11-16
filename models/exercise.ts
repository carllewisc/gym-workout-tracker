import mongoose, { Schema, Document } from 'mongoose';

// Interfaces
export interface IExercise extends Document {
  name: string;
  muscle: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schema
const ExerciseSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Exercise name is required'],
      trim: true,
      unique: true
    },
    muscle: {
      type: String,
      required: [true, 'Target muscle is required'],
      trim: true,
      enum: ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core']
    },
    image: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const Exercise = mongoose.models.Exercise || mongoose.model<IExercise>('Exercise', ExerciseSchema);

export { Exercise };
