import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Share2, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { IWorkout } from '@/models/workout';

type Props = {
  workout: IWorkout;
};

export default function WorkoutViewDetail({ workout }: Props) {
  const calculateTotal = () => {
    let totalReps = 0;
    let totalWeight = 0;

    if (!workout.exercises) return { totalReps, totalWeight };

    workout.exercises.forEach((exercise) => {
      exercise.sets.forEach((set) => {
        totalReps += set.reps;
        totalWeight += set.weight * set.reps;
      });
    });

    return { totalReps, totalWeight };
  };
  const { totalReps, totalWeight } = calculateTotal();

  return (
    <div className="container mx-auto max-w-5xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gym Workout</h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <time className="text-sm text-muted-foreground">{new Date(workout.date).toLocaleDateString()}</time>
        </div>
      </div>

      <div className="mb-6 overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Exercise</TableHead>
              <TableHead>Sets</TableHead>
              <TableHead className="text-right">Reps</TableHead>
              <TableHead className="text-right">Weight</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workout.exercises?.map((exercise, index) => (
              <TableRow key={exercise._id as string}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{exercise.name}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    {exercise.sets.map((set, setIndex) => (
                      <div key={setIndex} className="flex items-center gap-1">
                        <span className="rounded bg-muted px-2 py-1 text-sm">
                          {set.weight}kg × {set.reps}
                        </span>
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right">{exercise.sets.reduce((acc, set) => acc + set.reps, 0)}</TableCell>
                <TableCell className="text-right">
                  {exercise.sets.reduce((acc, set) => acc + set.weight * set.reps, 0)}
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3} className="font-medium">
                Total:
              </TableCell>
              <TableCell className="text-right font-medium">{totalReps} Reps</TableCell>
              <TableCell className="text-right font-medium">{totalWeight}kg</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="bodyweight">Bodyweight:</Label>
          <div className="mt-2 flex items-center gap-2">
            <Input id="bodyweight" value={workout.bodyweight} className="w-24" readOnly />
            <span className="text-muted-foreground">kg</span>
          </div>
        </div>

        <div>
          <Label htmlFor="notes">Notes:</Label>
          <Textarea id="notes" readOnly value={workout.notes} className="mt-2 resize-none" rows={4} />
        </div>
      </div>

      <div className="mt-6">
        <Label>Progress Image:</Label>
        <div className="mt-2 rounded-lg border p-4">
          {workout.image ? (
            <Image src={workout.image} alt="Progress" width={200} height={200} className="rounded-lg" />
          ) : (
            <div className="flex h-[200px] w-[200px] items-center justify-center rounded-lg bg-muted">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t pt-6">
        <div className="flex items-center gap-2">
          <Button>Save workout</Button>
          <Button variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete workout
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">Add to my workout plans</Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download .xls
          </Button>
        </div>
      </div>
    </div>
  );
}
