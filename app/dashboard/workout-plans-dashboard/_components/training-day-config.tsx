"use client"

import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { Save, Copy, Plus, Trash2, Search, GripVertical, Dumbbell } from 'lucide-react'

// Mock data for exercises
const exerciseList = [
  { id: 'e1', name: 'Barbell Squat', category: 'Legs', equipment: 'Barbell' },
  { id: 'e2', name: 'Bench Press', category: 'Chest', equipment: 'Barbell' },
  { id: 'e3', name: 'Deadlift', category: 'Back', equipment: 'Barbell' },
  { id: 'e4', name: 'Pull-ups', category: 'Back', equipment: 'Bodyweight' },
  { id: 'e5', name: 'Overhead Press', category: 'Shoulders', equipment: 'Barbell' },
]

type Exercise = {
  id: string
  name: string
  sets: number
  reps: string
  weight: string
  rest: number
  rpe: number
  notes: string
  formCues: string
}

type Group = {
  id: string
  type: 'superset' | 'circuit' | 'emom' | 'amrap'
  exercises: Exercise[]
  duration?: number
  rest?: number
}

export default function TrainingDayConfig() {
  const { toast } = useToast()
  const [isRestDay, setIsRestDay] = useState(false)
  const [workoutName, setWorkoutName] = useState('')
  const [estimatedDuration, setEstimatedDuration] = useState(60)
  const [difficultyLevel, setDifficultyLevel] = useState('intermediate')
  const [warmUp, setWarmUp] = useState('')
  const [coolDown, setCoolDown] = useState('')
  const [notes, setNotes] = useState('')
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [groups, setGroups] = useState<Group[]>([])

  const handleSaveChanges = () => {
    toast({
      title: "Changes Saved",
      description: "Your workout has been updated successfully.",
    })
  }

  const handleCopyWorkout = () => {
    toast({
      title: "Workout Copied",
      description: "The workout has been copied to your clipboard.",
    })
  }

  const addExercise = () => {
    const newExercise: Exercise = {
      id: `ex-${Date.now()}`,
      name: '',
      sets: 3,
      reps: '10',
      weight: '',
      rest: 60,
      rpe: 7,
      notes: '',
      formCues: '',
    }
    setExercises([...exercises, newExercise])
  }

  const updateExercise = (id: string, field: keyof Exercise, value: any) => {
    setExercises(exercises.map(ex =>
      ex.id === id ? { ...ex, [field]: value } : ex
    ))
  }

  const removeExercise = (id: string) => {
    setExercises(exercises.filter(ex => ex.id !== id))
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(exercises)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setExercises(items)
  }

  const createGroup = (type: 'superset' | 'circuit' | 'emom' | 'amrap') => {
    const newGroup: Group = {
      id: `group-${Date.now()}`,
      type,
      exercises: [],
      duration: type === 'emom' || type === 'amrap' ? 10 : undefined,
      rest: 60,
    }
    setGroups([...groups, newGroup])
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Monday - Week 1</h1>
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={handleCopyWorkout}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Workout
          </Button>
          <Button onClick={handleSaveChanges}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Workout Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="rest-day">Rest Day</Label>
            <Switch
              id="rest-day"
              checked={isRestDay}
              onCheckedChange={setIsRestDay}
            />
          </div>
          {!isRestDay && (
            <>
              <div className="space-y-2">
                <Label htmlFor="workout-name">Workout Name</Label>
                <Input
                  id="workout-name"
                  value={workoutName}
                  onChange={(e) => setWorkoutName(e.target.value)}
                  placeholder="Enter workout name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimated-duration">Estimated Duration (minutes)</Label>
                <Slider
                  id="estimated-duration"
                  min={15}
                  max={180}
                  step={15}
                  value={[estimatedDuration]}
                  onValueChange={(value) => setEstimatedDuration(value[0])}
                />
                <div className="text-center">{estimatedDuration} minutes</div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <Select value={difficultyLevel} onValueChange={setDifficultyLevel}>
                  <SelectTrigger id="difficulty">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="warm-up">Warm-up (optional)</Label>
                <Textarea
                  id="warm-up"
                  value={warmUp}
                  onChange={(e) => setWarmUp(e.target.value)}
                  placeholder="Enter warm-up instructions"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes/Instructions</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter any additional notes or instructions"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {!isRestDay && (
        <Card>
          <CardHeader>
            <CardTitle>Exercise Builder</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={addExercise} className="mb-4">
              <Plus className="mr-2 h-4 w-4" />
              Add Exercise
            </Button>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="exercises">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {exercises.map((exercise, index) => (
                      <Draggable key={exercise.id} draggableId={exercise.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="mb-4 p-4 bg-card rounded-lg border"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div {...provided.dragHandleProps}>
                                <GripVertical className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <Select
                                value={exercise.name}
                                onValueChange={(value) => updateExercise(exercise.id, 'name', value)}
                              >
                                <SelectTrigger className="w-[200px]">
                                  <SelectValue placeholder="Select exercise" />
                                </SelectTrigger>
                                <SelectContent>
                                  {exerciseList.map((ex) => (
                                    <SelectItem key={ex.id} value={ex.name}>
                                      {ex.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeExercise(exercise.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`sets-${exercise.id}`}>Sets</Label>
                                <Input
                                  id={`sets-${exercise.id}`}
                                  type="number"
                                  value={exercise.sets}
                                  onChange={(e) => updateExercise(exercise.id, 'sets', parseInt(e.target.value))}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`reps-${exercise.id}`}>Reps/Duration</Label>
                                <Input
                                  id={`reps-${exercise.id}`}
                                  value={exercise.reps}
                                  onChange={(e) => updateExercise(exercise.id, 'reps', e.target.value)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`weight-${exercise.id}`}>Weight/Intensity</Label>
                                <Input
                                  id={`weight-${exercise.id}`}
                                  value={exercise.weight}
                                  onChange={(e) => updateExercise(exercise.id, 'weight', e.target.value)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`rest-${exercise.id}`}>Rest (seconds)</Label>
                                <Input
                                  id={`rest-${exercise.id}`}
                                  type="number"
                                  value={exercise.rest}
                                  onChange={(e) => updateExercise(exercise.id, 'rest', parseInt(e.target.value))}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`rpe-${exercise.id}`}>RPE Target</Label>
                                <Slider
                                  id={`rpe-${exercise.id}`}
                                  min={1}
                                  max={10}
                                  step={1}
                                  value={[exercise.rpe]}
                                  onValueChange={(value) => updateExercise(exercise.id, 'rpe', value[0])}
                                />
                                <div className="text-center">RPE {exercise.rpe}</div>
                              </div>
                            </div>
                            <div className="space-y-2 mt-4">
                              <Label htmlFor={`notes-${exercise.id}`}>Exercise Notes</Label>
                              <Textarea
                                id={`notes-${exercise.id}`}
                                value={exercise.notes}
                                onChange={(e) => updateExercise(exercise.id, 'notes', e.target.value)}
                                placeholder="Enter any notes for this exercise"
                              />
                            </div>
                            <div className="space-y-2 mt-4">
                              <Label htmlFor={`form-cues-${exercise.id}`}>Form Cues</Label>
                              <Textarea
                                id={`form-cues-${exercise.id}`}
                                value={exercise.formCues}
                                onChange={(e) => updateExercise(exercise.id, 'formCues', e.target.value)}
                                placeholder="Enter form cues for this exercise"
                              />
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </CardContent>
        </Card>
      )}

      {!isRestDay && (
        <Card>
          <CardHeader>
            <CardTitle>Grouping Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Button onClick={() => createGroup('superset')}>Create Superset</Button>
              <Button onClick={() => createGroup('circuit')}>Create Circuit</Button>
              <Button onClick={() => createGroup('emom')}>Create EMOM</Button>
              <Button onClick={() => createGroup('amrap')}>Create AMRAP</Button>
            </div>
            {groups.map((group) => (
              <Card key={group.id}>
                <CardHeader>
                  <CardTitle>{group.type.toUpperCase()}</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Group configuration UI here */}
                  <p>Group configuration for {group.type}</p>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {!isRestDay && (
        <Card>
          <CardHeader>
            <CardTitle>Additional Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cool-down">Cool-down Section</Label>
              <Textarea
                id="cool-down"
                value={coolDown}
                onChange={(e) => setCoolDown(e.target.value)}
                placeholder="Enter cool-down instructions"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="alternative-exercises">Alternative Exercises</Label>
              <Textarea
                id="alternative-exercises"
                placeholder="Enter alternative exercises"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="progress-metrics">Progress Tracking Metrics</Label>
              <Textarea
                id="progress-metrics"
                placeholder="Enter progress tracking metrics"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="technical-notes">Technical Notes for Trainer</Label>
              <Textarea
                id="technical-notes"
                placeholder="Enter any technical notes for the trainer"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}