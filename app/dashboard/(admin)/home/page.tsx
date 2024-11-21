'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Search, Plus, Edit, Trash2, MoreVertical, LogOut } from 'lucide-react';
import UserManagement from './_components/user-management';
import AdminSettings from './_components/admin-settings';
import ReportingDashboard from './_components/reporting-dashboard';
import ReportsDashboard from './_components/reports-dashboard';
import PageContainer from '@/components/layout/page-container';

// Mock data for exercises
const initialExercises = [
  {
    id: '1',
    name: 'Bench Press',
    primaryMuscle: 'Chest',
    equipment: ['Barbell', 'Bench'],
    usageCount: 50,
    dateAdded: '2023-05-15',
    lastModified: '2023-06-10',
    createdBy: 'John Doe',
    difficulty: 'Intermediate',
    description: 'A compound exercise that primarily targets the chest muscles.',
    formInstructions:
      '1. Lie on a flat bench\n2. Grip the bar with hands slightly wider than shoulder-width\n3. Lower the bar to your chest\n4. Push the bar back up to the starting position',
    videoLink: 'https://example.com/bench-press-video',
    imageLink: 'https://example.com/bench-press-image',
    alternativeNames: ['Chest Press'],
    relatedExercises: ['Incline Bench Press', 'Dumbbell Bench Press'],
    tags: ['Strength', 'Upper Body'],
    qualityStatus: 'Verified',
    userFeedback: 4.8
  },
  {
    id: '2',
    name: 'Squats',
    primaryMuscle: 'Legs',
    equipment: ['Barbell', 'Squat Rack'],
    usageCount: 45,
    dateAdded: '2023-05-16',
    lastModified: '2023-06-09',
    createdBy: 'Jane Smith',
    difficulty: 'Intermediate',
    description: 'A compound lower body exercise that targets multiple muscle groups.',
    formInstructions:
      '1. Stand with feet shoulder-width apart\n2. Lower your body as if sitting back into a chair\n3. Keep your chest up and knees in line with your toes\n4. Push through your heels to return to the starting position',
    videoLink: 'https://example.com/squats-video',
    imageLink: 'https://example.com/squats-image',
    alternativeNames: ['Barbell Squats'],
    relatedExercises: ['Front Squats', 'Leg Press'],
    tags: ['Strength', 'Lower Body'],
    qualityStatus: 'Needs Review',
    userFeedback: 4.5
  }
  // Add more exercises here...
];

const muscleGroups = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];
const equipmentList = [
  'Barbell',
  'Dumbbell',
  'Kettlebell',
  'Resistance Bands',
  'Bodyweight',
  'Machines',
  'Cables',
  'Bench',
  'Squat Rack',
  'Pull-up Bar'
];
const difficultyLevels = ['Beginner', 'Intermediate', 'Advanced'];

type Exercise = {
  id: string;
  name: string;
  primaryMuscle: string;
  equipment: string[];
  usageCount: number;
  dateAdded: string;
  lastModified: string;
  createdBy: string;
  difficulty: string;
  description: string;
  formInstructions: string;
  videoLink: string;
  imageLink: string;
  alternativeNames: string[];
  relatedExercises: string[];
  tags: string[];
  qualityStatus: 'Verified' | 'Needs Review' | 'Reported';
  userFeedback: number;
};

const AdminDashboard: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>(initialExercises);
  const [searchTerm, setSearchTerm] = useState('');
  const [muscleFilter, setMuscleFilter] = useState<string | null>(null);
  const [equipmentFilter, setEquipmentFilter] = useState<string | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [newExercise, setNewExercise] = useState<Partial<Exercise>>({});
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Simulating data fetch
    const fetchExercises = async () => {
      // In a real app, you would fetch data from an API here
      setExercises(initialExercises);
    };
    fetchExercises();
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleFilter = (type: 'muscle' | 'equipment' | 'difficulty', value: string | null) => {
    switch (type) {
      case 'muscle':
        setMuscleFilter(value);
        break;
      case 'equipment':
        setEquipmentFilter(value);
        break;
      case 'difficulty':
        setDifficultyFilter(value);
        break;
    }
  };

  const filteredExercises = exercises.filter(
    (exercise) =>
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!muscleFilter || exercise.primaryMuscle === muscleFilter) &&
      (!equipmentFilter || exercise.equipment.includes(equipmentFilter)) &&
      (!difficultyFilter || exercise.difficulty === difficultyFilter)
  );

  const handleAddExercise = () => {
    setNewExercise({});
    setIsAddModalOpen(true);
  };

  const handleEditExercise = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setNewExercise(exercise);
    setIsAddModalOpen(true);
  };

  const handleSaveExercise = () => {
    if (editingExercise) {
      setExercises(
        exercises.map((ex) =>
          ex.id === editingExercise.id
            ? ({ ...ex, ...newExercise, lastModified: new Date().toISOString().split('T')[0] } as Exercise)
            : ex
        )
      );
      toast({ title: 'Exercise updated', description: 'The exercise has been successfully updated.' });
    } else {
      const id = (Math.max(...exercises.map((ex) => parseInt(ex.id))) + 1).toString();
      const currentDate = new Date().toISOString().split('T')[0];
      setExercises([
        ...exercises,
        {
          id,
          ...(newExercise as Exercise),
          dateAdded: currentDate,
          lastModified: currentDate,
          createdBy: 'Admin User', // In a real app, this would be the current user's name
          usageCount: 0,
          qualityStatus: 'Needs Review',
          userFeedback: 0
        }
      ]);
      toast({ title: 'Exercise added', description: 'The new exercise has been successfully added.' });
    }
    setIsAddModalOpen(false);
    setEditingExercise(null);
    setNewExercise({});
  };

  const handleDeleteExercise = (id: string) => {
    setExercises(exercises.filter((ex) => ex.id !== id));
    toast({ title: 'Exercise deleted', description: 'The exercise has been successfully deleted.' });
  };

  const handleBulkDelete = () => {
    setExercises(exercises.filter((ex) => !selectedExercises.includes(ex.id)));
    setSelectedExercises([]);
    toast({ title: 'Exercises deleted', description: `${selectedExercises.length} exercises have been deleted.` });
  };

  const handleBulkVerify = () => {
    setExercises(
      exercises.map((ex) => (selectedExercises.includes(ex.id) ? { ...ex, qualityStatus: 'Verified' } : ex))
    );
    setSelectedExercises([]);
    toast({ title: 'Exercises verified', description: `${selectedExercises.length} exercises have been verified.` });
  };

  const totalExercises = exercises.length;
  const mostUsedExercise = exercises.reduce((prev, current) => (prev.usageCount > current.usageCount ? prev : current));
  const recentlyAdded = exercises.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())[0];
  const needsReview = exercises.filter((ex) => ex.qualityStatus === 'Needs Review').length;

  return (
    <PageContainer scrollable>
      <div className="container mx-auto p-4">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src="/placeholder-avatar.jpg" alt="Admin User" />
                <AvatarFallback>AU</AvatarFallback>
              </Avatar>
              <span>Admin User</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <Tabs defaultValue="exercises">
          <TabsList>
            <TabsTrigger value="exercises">Exercises</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="reports-dashboard">Reports Dashboard</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="exercises">
            <Card>
              <CardHeader>
                <CardTitle>Exercise Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Exercises</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{totalExercises}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Most Used Exercise</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{mostUsedExercise.name}</div>
                      <p className="text-xs text-muted-foreground">Used {mostUsedExercise.usageCount} times</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Recently Added</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{recentlyAdded.name}</div>
                      <p className="text-xs text-muted-foreground">Added on {recentlyAdded.dateAdded}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Needs Review</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{needsReview}</div>
                      <p className="text-xs text-muted-foreground">Exercises requiring review</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="mb-4 flex flex-col items-center justify-between space-y-2 md:flex-row md:space-y-0">
                  <div className="w-full flex-1 md:w-auto">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 transform text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Search exercises..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full pl-8"
                      />
                    </div>
                  </div>
                  <div className="flex w-full space-x-2 md:w-auto">
                    <Select value={muscleFilter || ''} onValueChange={(value) => handleFilter('muscle', value || null)}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Muscle Group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All muscles</SelectItem>
                        {muscleGroups.map((group) => (
                          <SelectItem key={group} value={group}>
                            {group}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={equipmentFilter || ''}
                      onValueChange={(value) => handleFilter('equipment', value || null)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Equipment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All equipment</SelectItem>
                        {equipmentList.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={difficultyFilter || ''}
                      onValueChange={(value) => handleFilter('difficulty', value || null)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All difficulties</SelectItem>
                        {difficultyLevels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button onClick={handleAddExercise}>
                      <Plus className="mr-2 h-4 w-4" /> Add Exercise
                    </Button>
                  </div>
                </div>

                {selectedExercises.length > 0 && (
                  <div className="mb-4 flex space-x-2">
                    <Button variant="destructive" onClick={handleBulkDelete}>
                      Delete Selected ({selectedExercises.length})
                    </Button>
                    <Button variant="outline" onClick={handleBulkVerify}>
                      Verify Selected ({selectedExercises.length})
                    </Button>
                  </div>
                )}

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[30px]">
                        <Checkbox
                          checked={selectedExercises.length === filteredExercises.length}
                          onCheckedChange={(checked) => {
                            setSelectedExercises(checked ? filteredExercises.map((ex) => ex.id) : []);
                          }}
                        />
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Muscle Group</TableHead>
                      <TableHead>Equipment</TableHead>
                      <TableHead>Difficulty</TableHead>
                      <TableHead>Usage Count</TableHead>
                      <TableHead>Date Added</TableHead>
                      <TableHead>Last Modified</TableHead>
                      <TableHead>Created By</TableHead>
                      <TableHead>Quality Status</TableHead>
                      <TableHead>User Feedback</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExercises.map((exercise) => (
                      <TableRow key={exercise.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedExercises.includes(exercise.id)}
                            onCheckedChange={(checked) => {
                              setSelectedExercises(
                                checked
                                  ? [...selectedExercises, exercise.id]
                                  : selectedExercises.filter((id) => id !== exercise.id)
                              );
                            }}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{exercise.name}</TableCell>
                        <TableCell>{exercise.primaryMuscle}</TableCell>
                        <TableCell>{exercise.equipment.join(', ')}</TableCell>
                        <TableCell>{exercise.difficulty}</TableCell>
                        <TableCell>{exercise.usageCount}</TableCell>
                        <TableCell>{exercise.dateAdded}</TableCell>
                        <TableCell>{exercise.lastModified}</TableCell>
                        <TableCell>{exercise.createdBy}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              exercise.qualityStatus === 'Verified'
                                ? 'default'
                                : exercise.qualityStatus === 'Needs Review'
                                ? 'secondary'
                                : 'destructive'
                            }
                          >
                            {exercise.qualityStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className="mr-2">{exercise.userFeedback.toFixed(1)}</span>
                            <Progress value={exercise.userFeedback * 20} className="w-[60px]" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditExercise(exercise)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteExercise(exercise.id)}>
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <UserManagement />
            </Card>
          </TabsContent>
          <TabsContent value="reports">
            <ReportingDashboard />
          </TabsContent>
          <TabsContent value="reports-dashboard">
            <ReportsDashboard />
          </TabsContent>
          <TabsContent value="settings">
            <Card>
              <AdminSettings />
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>{editingExercise ? 'Edit Exercise' : 'Add New Exercise'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newExercise.name || ''}
                  onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="primaryMuscle" className="text-right">
                  Primary Muscle
                </Label>
                <Select
                  value={newExercise.primaryMuscle || ''}
                  onValueChange={(value) => setNewExercise({ ...newExercise, primaryMuscle: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select primary muscle" />
                  </SelectTrigger>
                  <SelectContent>
                    {muscleGroups.map((group) => (
                      <SelectItem key={group} value={group}>
                        {group}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Equipment</Label>
                <ScrollArea className="col-span-3 h-[200px]">
                  {equipmentList.map((item) => (
                    <div key={item} className="flex items-center space-x-2">
                      <Checkbox
                        id={item}
                        checked={(newExercise.equipment || []).includes(item)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setNewExercise({ ...newExercise, equipment: [...(newExercise.equipment || []), item] });
                          } else {
                            setNewExercise({
                              ...newExercise,
                              equipment: (newExercise.equipment || []).filter((e) => e !== item)
                            });
                          }
                        }}
                      />
                      <label
                        htmlFor={item}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {item}
                      </label>
                    </div>
                  ))}
                </ScrollArea>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="difficulty" className="text-right">
                  Difficulty
                </Label>
                <Select
                  value={newExercise.difficulty || ''}
                  onValueChange={(value) => setNewExercise({ ...newExercise, difficulty: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficultyLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={newExercise.description || ''}
                  onChange={(e) => setNewExercise({ ...newExercise, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="formInstructions" className="text-right">
                  Form Instructions
                </Label>
                <Textarea
                  id="formInstructions"
                  value={newExercise.formInstructions || ''}
                  onChange={(e) => setNewExercise({ ...newExercise, formInstructions: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="videoLink" className="text-right">
                  Video Link
                </Label>
                <Input
                  id="videoLink"
                  value={newExercise.videoLink || ''}
                  onChange={(e) => setNewExercise({ ...newExercise, videoLink: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="imageLink" className="text-right">
                  Image Link
                </Label>
                <Input
                  id="imageLink"
                  value={newExercise.imageLink || ''}
                  onChange={(e) => setNewExercise({ ...newExercise, imageLink: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="alternativeNames" className="text-right">
                  Alternative Names
                </Label>
                <Input
                  id="alternativeNames"
                  value={newExercise.alternativeNames?.join(', ') || ''}
                  onChange={(e) => setNewExercise({ ...newExercise, alternativeNames: e.target.value.split(', ') })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="relatedExercises" className="text-right">
                  Related Exercises
                </Label>
                <Input
                  id="relatedExercises"
                  value={newExercise.relatedExercises?.join(', ') || ''}
                  onChange={(e) => setNewExercise({ ...newExercise, relatedExercises: e.target.value.split(', ') })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tags" className="text-right">
                  Tags
                </Label>
                <Input
                  id="tags"
                  value={newExercise.tags?.join(', ') || ''}
                  onChange={(e) => setNewExercise({ ...newExercise, tags: e.target.value.split(', ') })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleSaveExercise}>
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageContainer>
  );
};

export default AdminDashboard;
