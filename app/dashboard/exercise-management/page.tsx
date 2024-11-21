"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Search, Plus, Grid, List, Dumbbell, Edit, Trash2, Star, MoreVertical } from 'lucide-react'

// Mock data for exercises
const initialExercises = [
  { id: '1', name: 'Bench Press', primaryMuscle: 'Chest', equipment: ['Barbell', 'Bench'], usageCount: 50, isFavorite: true, lastUsed: '2023-06-10' },
  { id: '2', name: 'Squats', primaryMuscle: 'Legs', equipment: ['Barbell', 'Squat Rack'], usageCount: 45, isFavorite: false, lastUsed: '2023-06-09' },
  { id: '3', name: 'Deadlifts', primaryMuscle: 'Back', equipment: ['Barbell'], usageCount: 40, isFavorite: true, lastUsed: '2023-06-08' },
  { id: '4', name: 'Pull-ups', primaryMuscle: 'Back', equipment: ['Pull-up Bar'], usageCount: 35, isFavorite: false, lastUsed: '2023-06-07' },
  { id: '5', name: 'Shoulder Press', primaryMuscle: 'Shoulders', equipment: ['Dumbbells'], usageCount: 30, isFavorite: false, lastUsed: '2023-06-06' },
]

const muscleGroups = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core']
const equipmentList = ['Barbell', 'Dumbbell', 'Kettlebell', 'Resistance Bands', 'Bodyweight', 'Machines', 'Cables', 'Bench', 'Squat Rack', 'Pull-up Bar']

type Exercise = {
  id: string
  name: string
  primaryMuscle: string
  equipment: string[]
  usageCount: number
  isFavorite: boolean
  lastUsed: string
  description?: string
  secondaryMuscles?: string[]
  formTips?: string[]
  imageUrl?: string
}

const ExerciseManagement: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>(initialExercises)
  const [searchTerm, setSearchTerm] = useState('')
  const [muscleFilter, setMuscleFilter] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null)
  const [newExercise, setNewExercise] = useState<Partial<Exercise>>({})
  const [selectedExercises, setSelectedExercises] = useState<string[]>([])
  const { toast } = useToast()

  useEffect(() => {
    // Simulating data fetch
    const fetchExercises = async () => {
      // In a real app, you would fetch data from an API here
      setExercises(initialExercises)
    }
    fetchExercises()
  }, [])

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  const handleMuscleFilter = (muscle: string | null) => {
    setMuscleFilter(muscle)
  }

  const filteredExercises = exercises.filter(exercise =>
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (!muscleFilter || exercise.primaryMuscle === muscleFilter)
  )

  const handleAddExercise = () => {
    setNewExercise({})
    setIsAddModalOpen(true)
  }

  const handleEditExercise = (exercise: Exercise) => {
    setEditingExercise(exercise)
    setNewExercise(exercise)
    setIsAddModalOpen(true)
  }

  const handleSaveExercise = () => {
    if (editingExercise) {
      setExercises(exercises.map(ex => ex.id === editingExercise.id ? { ...ex, ...newExercise } : ex))
      toast({ title: "Exercise updated", description: "The exercise has been successfully updated." })
    } else {
      const id = (Math.max(...exercises.map(ex => parseInt(ex.id))) + 1).toString()
      setExercises([...exercises, { id, ...newExercise as Exercise }])
      toast({ title: "Exercise added", description: "The new exercise has been successfully added." })
    }
    setIsAddModalOpen(false)
    setEditingExercise(null)
    setNewExercise({})
  }

  const handleDeleteExercise = (id: string) => {
    setExercises(exercises.filter(ex => ex.id !== id))
    toast({ title: "Exercise deleted", description: "The exercise has been successfully deleted." })
  }

  const handleToggleFavorite = (id: string) => {
    setExercises(exercises.map(ex =>
      ex.id === id ? { ...ex, isFavorite: !ex.isFavorite } : ex
    ))
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(exercises)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setExercises(items)
  }

  const handleBulkDelete = () => {
    setExercises(exercises.filter(ex => !selectedExercises.includes(ex.id)))
    setSelectedExercises([])
    toast({ title: "Exercises deleted", description: `${selectedExercises.length} exercises have been deleted.` })
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Exercise Management</CardTitle>
          <Button onClick={handleAddExercise}>
            <Plus className="mr-2 h-4 w-4" /> Add Exercise
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search exercises..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={muscleFilter || ''} onValueChange={(value) => handleMuscleFilter(value || null)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by muscle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All muscles</SelectItem>
                {muscleGroups.map(group => (
                  <SelectItem key={group} value={group}>{group}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
              {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
            </Button>
          </div>

          {selectedExercises.length > 0 && (
            <div className="mb-4">
              <Button variant="destructive" onClick={handleBulkDelete}>
                Delete Selected ({selectedExercises.length})
              </Button>
            </div>
          )}

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="exercises">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredExercises.map((exercise, index) => (
                        <Draggable key={exercise.id} draggableId={exercise.id} index={index}>
                          {(provided) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="flex flex-col justify-between"
                            >
                              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-lg font-semibold">{exercise.name}</CardTitle>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleToggleFavorite(exercise.id)}
                                >
                                  <Star className={`h-4 w-4 ${exercise.isFavorite ? 'fill-yellow-400' : ''}`} />
                                </Button>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-muted-foreground mb-2">{exercise.primaryMuscle}</p>
                                <p className="text-sm mb-2">Equipment: {exercise.equipment.join(', ')}</p>
                                <p className="text-sm mb-2">Used {exercise.usageCount} times</p>
                                <p className="text-sm text-muted-foreground">Last used: {exercise.lastUsed}</p>
                              </CardContent>
                              <CardContent className="flex justify-end space-x-2">
                                <Button variant="outline" size="sm" onClick={() => handleEditExercise(exercise)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleDeleteExercise(exercise.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[30px]">
                            <Checkbox
                              checked={selectedExercises.length === filteredExercises.length}
                              onCheckedChange={(checked) => {
                                setSelectedExercises(checked ? filteredExercises.map(ex => ex.id) : [])
                              }}
                            />
                          </TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Muscle Group</TableHead>
                          <TableHead>Equipment</TableHead>
                          <TableHead>Usage Count</TableHead>
                          <TableHead>Last Used</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredExercises.map((exercise, index) => (
                          <Draggable key={exercise.id} draggableId={exercise.id} index={index}>
                            {(provided) => (
                              <TableRow
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <TableCell>
                                  <Checkbox
                                    checked={selectedExercises.includes(exercise.id)}
                                    onCheckedChange={(checked) => {
                                      setSelectedExercises(
                                        checked
                                          ? [...selectedExercises, exercise.id]
                                          : selectedExercises.filter(id => id !== exercise.id)
                                      )
                                    }}
                                  />
                                </TableCell>
                                <TableCell className="font-medium">
                                  {exercise.name}
                                  {exercise.isFavorite && <Star className="inline-block ml-2 h-4 w-4 fill-yellow-400" />}
                                </TableCell>
                                <TableCell>{exercise.primaryMuscle}</TableCell>
                                <TableCell>{exercise.equipment.join(', ')}</TableCell>
                                <TableCell>{exercise.usageCount}</TableCell>
                                <TableCell>{exercise.lastUsed}</TableCell>
                                <TableCell>
                                  <Button variant="ghost" size="sm" onClick={() => handleEditExercise(exercise)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => handleDeleteExercise(exercise.id)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            )}
                          </Draggable>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </CardContent>
      </Card>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
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
                  {muscleGroups.map(group => (
                    <SelectItem key={group} value={group}>{group}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Equipment</Label>
              <ScrollArea className="h-[200px] col-span-3">
                {equipmentList.map(item => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox
                      id={item}
                      checked={(newExercise.equipment || []).includes(item)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setNewExercise({ ...newExercise, equipment: [...(newExercise.equipment || []), item] })
                        } else {
                          setNewExercise({ ...newExercise, equipment: (newExercise.equipment || []).filter(e => e !== item) })
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
              <Label htmlFor="formTips" className="text-right">
                Form Tips
              </Label>
              <Textarea
                id="formTips"
                value={newExercise.formTips?.join('\n') || ''}
                onChange={(e) => setNewExercise({ ...newExercise, formTips: e.target.value.split('\n') })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imageUrl" className="text-right">
                Image URL
              </Label>
              <Input
                id="imageUrl"
                value={newExercise.imageUrl || ''}
                onChange={(e) => setNewExercise({ ...newExercise, imageUrl: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSaveExercise}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ExerciseManagement