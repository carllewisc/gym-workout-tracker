// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Dumbbell, X, Heart, Play, Plus, History, Edit, Share2, ArrowUp, ArrowDown } from 'lucide-react';

type ExerciseDetailsProps = {
  isOpen: boolean;
  onClose: () => void;
  exercise: {
    id: string;
    name: string;
    muscleGroup: string;
    description: string;
    primaryMuscles: string[];
    secondaryMuscles: string[];
    equipment: string[];
    formTips: string[];
    videoUrl: string;
  };
};

const mockHistoryData = [
  { date: '2023-05-01', weight: 100, reps: 8 },
  { date: '2023-05-08', weight: 105, reps: 8 },
  { date: '2023-05-15', weight: 110, reps: 7 },
  { date: '2023-05-22', weight: 110, reps: 8 },
  { date: '2023-05-29', weight: 115, reps: 7 },
  { date: '2023-06-05', weight: 115, reps: 8 }
];

const mockRecentSets = [
  { date: '2023-06-05', weight: 115, reps: 8 },
  { date: '2023-06-05', weight: 115, reps: 7 },
  { date: '2023-06-05', weight: 110, reps: 8 },
  { date: '2023-05-29', weight: 115, reps: 7 },
  { date: '2023-05-29', weight: 110, reps: 8 }
];

const mockPersonalRecords = [
  { type: 'Max Weight', value: '120 kg', date: '2023-05-15' },
  { type: 'Max Reps', value: '12 reps', date: '2023-04-20' },
  { type: 'Max Volume', value: '1500 kg', date: '2023-05-22' }
];

const mockStatistics = {
  totalVolume: 15000,
  averageWeight: 112.5,
  averageReps: 7.6,
  frequency: 1.2,
  bestWorkout: '2023-05-22',
  progress: 15
};

const ExerciseDetailsModal: React.FC<ExerciseDetailsProps> = ({ isOpen, onClose, exercise }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast();

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? 'Removed from favorites' : 'Added to favorites',
      description: exercise.name
    });
  };

  const handleAddToWorkout = () => {
    // Logic to add exercise to current workout
    toast({
      title: 'Added to workout',
      description: `${exercise.name} has been added to your current workout.`
    });
  };

  const handleViewFullHistory = () => {
    // Logic to view full history
    toast({
      title: 'View full history',
      description: `Viewing full history for ${exercise.name}.`
    });
  };

  const handleEditExercise = () => {
    // Logic to edit exercise details
    toast({
      title: 'Edit exercise',
      description: `Editing details for ${exercise.name}.`
    });
  };

  const handleShareWorkout = () => {
    // Logic to share workout
    toast({
      title: 'Share workout',
      description: `Sharing workout containing ${exercise.name}.`
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-2xl font-bold">
            <div className="flex items-center">
              <Dumbbell className="mr-2 h-6 w-6 text-primary" />
              {exercise.name}
              <span className="ml-2 text-sm font-normal text-muted-foreground">({exercise.muscleGroup})</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={handleFavoriteToggle}>
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
          </TabsList>
          <TabsContent value="info">
            <ScrollArea className="h-[400px] w-full rounded-md border p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 text-lg font-semibold">Description</h3>
                  <p>{exercise.description}</p>
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold">Muscles Worked</h3>
                  <div className="flex flex-wrap gap-2">
                    {exercise.primaryMuscles.map((muscle) => (
                      <span key={muscle} className="rounded-full bg-primary px-2 py-1 text-sm text-primary-foreground">
                        {muscle}
                      </span>
                    ))}
                    {exercise.secondaryMuscles.map((muscle) => (
                      <span
                        key={muscle}
                        className="rounded-full bg-secondary px-2 py-1 text-sm text-secondary-foreground"
                      >
                        {muscle}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold">Equipment Needed</h3>
                  <ul className="list-inside list-disc">
                    {exercise.equipment.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold">Form Tips</h3>
                  <ul className="list-inside list-disc">
                    {exercise.formTips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold">Video Tutorial</h3>
                  <div className="flex aspect-video items-center justify-center rounded-lg bg-muted">
                    <Button variant="ghost" size="icon" className="h-16 w-16">
                      <Play className="h-8 w-8" />
                    </Button>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="history">
            <ScrollArea className="h-[400px] w-full rounded-md border p-4">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Progress Chart</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={mockHistoryData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Line yAxisId="left" type="monotone" dataKey="weight" stroke="#E5BA73" />
                        <Line yAxisId="right" type="monotone" dataKey="reps" stroke="#A47E3B" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Sets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Weight</TableHead>
                          <TableHead>Reps</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockRecentSets.map((set, index) => (
                          <TableRow key={index}>
                            <TableCell>{set.date}</TableCell>
                            <TableCell>{set.weight} kg</TableCell>
                            <TableCell>{set.reps}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Records</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockPersonalRecords.map((record, index) => (
                          <TableRow key={index}>
                            <TableCell>{record.type}</TableCell>
                            <TableCell>{record.value}</TableCell>
                            <TableCell>{record.date}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="statistics">
            <ScrollArea className="h-[400px] w-full rounded-md border p-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Total Volume Lifted</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{mockStatistics.totalVolume.toLocaleString()} kg</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Average Weight/Reps</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {mockStatistics.averageWeight} kg / {mockStatistics.averageReps}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Frequency of Use</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{mockStatistics.frequency} times/week</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Best Workout</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{mockStatistics.bestWorkout}</p>
                  </CardContent>
                </Card>
                <Card className="col-span-2">
                  <CardHeader>
                    <CardTitle>Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <p className="mr-2 text-2xl font-bold">{mockStatistics.progress}%</p>
                      {mockStatistics.progress > 0 ? (
                        <ArrowUp className="text-green-500" />
                      ) : (
                        <ArrowDown className="text-red-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">Compared to last month</p>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
        <div className="mt-4 flex flex-wrap justify-between gap-2">
          <Button onClick={handleAddToWorkout}>
            <Plus className="mr-2 h-4 w-4" /> Add to Workout
          </Button>
          <Button variant="outline" onClick={handleViewFullHistory}>
            <History className="mr-2 h-4 w-4" /> View Full History
          </Button>
          <Button variant="outline" onClick={handleEditExercise}>
            <Edit className="mr-2 h-4 w-4" /> Edit Exercise
          </Button>
          <Button variant="outline" onClick={handleShareWorkout}>
            <Share2 className="mr-2 h-4 w-4" /> Share Workout
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
ExerciseDetailsModal.defaultProps = {
  isOpen: true,
  onClose: () => {},
  exercise: {
    id: '1',
    name: 'Bench Press',
    muscleGroup: 'Chest',
    description:
      'The bench press is a compound exercise that builds strength and muscle in the chest, triceps, and shoulders.',
    primaryMuscles: ['Chest', 'Triceps', 'Shoulders'],
    secondaryMuscles: ['Upper Back', 'Abs'],
    equipment: ['Barbell', 'Bench'],
    formTips: ['Keep your feet flat on the ground', 'Squeeze your']
  }
};

export default ExerciseDetailsModal;
