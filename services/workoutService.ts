import { IWorkout, Workout } from '@/models/workout';

export class WorkoutService {
  static async createWorkout(workoutData: IWorkout) {
    try {
      const workout = new Workout(workoutData);
      await workout.validate();
      return await workout.save();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error creating workout: ${error.message}`);
      }
      throw new Error('Unknown error occurred while creating workout');
    }
  }

  static async getWorkouts(page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const workouts = await Workout.find().sort({ date: -1 }).skip(skip).limit(limit).exec();

      const total = await Workout.countDocuments();

      return {
        workouts,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error fetching workouts: ${error.message}`);
      }
      throw new Error('Unknown error occurred while fetching workouts');
    }
  }

  static async getWorkoutById(id: string) {
    try {
      return await Workout.findById(id).exec();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error fetching workout: ${error.message}`);
      }
      throw new Error('Unknown error occurred while fetching workout');
    }
  }

  static async deleteWorkout(id: string) {
    try {
      const workout = await Workout.findByIdAndDelete(id).exec();
      if (!workout) {
        throw new Error('Workout not found');
      }
      return workout;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error deleting workout: ${error.message}`);
      }
      throw new Error('Unknown error occurred while deleting workout');
    }
  }
}
