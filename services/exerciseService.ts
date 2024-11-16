import { Exercise, IExercise } from '@/models/exercise';

export class ExerciseService {
  static async createExercise(exerciseData: IExercise) {
    try {
      const exercise = new Exercise(exerciseData);
      await exercise.validate();
      return await exercise.save();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error creating exercise: ${error.message}`);
      }
      throw new Error('Unknown error occurred while creating exercise');
    }
  }

  static async getExercises(page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const exercises = await Exercise.find().sort({ name: 1 }).skip(skip).limit(limit).exec();

      const total = await Exercise.countDocuments();

      return {
        exercises,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error fetching exercises: ${error.message}`);
      }
      throw new Error('Unknown error occurred while fetching exercises');
    }
  }

  static async getExerciseById(id: string) {
    try {
      const exercise = await Exercise.findById(id).exec();
      if (!exercise) {
        throw new Error('Exercise not found');
      }
      return exercise;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error fetching exercise: ${error.message}`);
      }
      throw new Error('Unknown error occurred while fetching exercise');
    }
  }

  static async updateExercise(id: string, exerciseData: Partial<IExercise>) {
    try {
      const exercise = await Exercise.findByIdAndUpdate(id, exerciseData, {
        new: true,
        runValidators: true
      }).exec();

      if (!exercise) {
        throw new Error('Exercise not found');
      }

      return exercise;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error updating exercise: ${error.message}`);
      }
      throw new Error('Unknown error occurred while updating exercise');
    }
  }

  static async deleteExercise(id: string) {
    try {
      const exercise = await Exercise.findByIdAndDelete(id).exec();
      if (!exercise) {
        throw new Error('Exercise not found');
      }
      return exercise;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error deleting exercise: ${error.message}`);
      }
      throw new Error('Unknown error occurred while deleting exercise');
    }
  }

  static async searchExercises(query: string, muscle?: string) {
    try {
      // Build search criteria
      const searchCriteria: any = {
        name: { $regex: query, $options: 'i' } // Case-insensitive search
      };

      if (muscle) {
        searchCriteria.muscle = muscle;
      }

      const exercises = await Exercise.find(searchCriteria).sort({ name: 1 }).limit(10).exec();

      return exercises;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error searching exercises: ${error.message}`);
      }
      throw new Error('Unknown error occurred while searching exercises');
    }
  }

  static async getExercisesByMuscle(muscle: string) {
    try {
      const exercises = await Exercise.find({ muscle }).sort({ name: 1 }).exec();

      return exercises;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error fetching exercises by muscle: ${error.message}`);
      }
      throw new Error('Unknown error occurred while fetching exercises by muscle');
    }
  }
}
