"use client"

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { X, Plus, Info, GripVertical, ChevronDown, ChevronUp } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

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
  formCues: string
  alternatives: string[]
}

type Superset = {
  id: string
  exercises: Exercise[]
  restBetweenExercises: number
  restAfterSuperset: number
  rounds: number
  progressionPattern: string
  notes: string
  timeGoal: number
  trackingMetrics: string[]
}

export default function SupersetConfigModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [superset, setSuperset] = useState<Superset>({
    id: `superset-${Date.now()}`,
    exercises: [
      {
        id: `ex-${Date.now()}`,
        name: '',
        sets: 3,
        reps: '10',
        weight: '',
        rest: 60,
        rpe: 7,
        formCues: '',
        alternatives: [],
      },
    ],
    restBetweenExercises: 30,
    restAfterSuperset: 90,
    rounds: 3,
    progressionPattern: '',
    notes: '',
    timeGoal: 0,
    trackingMetrics: [],
  })

  const addExercise = () => {
    setSuperset({
      ...superset,
      exercises: [
        ...superset.exercises,
        {
          id: `ex-${Date.now()}`,
          name: '',
          sets: superset.exercises[0].sets,
          reps: superset.exercises[0].reps,
          weight: '',
          rest: 60,
          rpe: 7,
          formCues: '',
          alternatives: [],
        },
      ],
    })
  }

  const updateExercise = (index: number, field: keyof Exercise, value: any) => {
    const updatedExercises = [...superset.exercises]
    updatedExercises[index] = { ...updatedExercises[index], [field]: value }
    setSuperset({ ...superset, exercises: updatedExercises })
  }

  const removeExercise = (index: number) => {
    const updatedExercises = superset.exercises.filter((_, i) => i !== index)
    setSuperset({ ...superset, exercises: updatedExercises })
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const exercises = Array.from(superset.exercises)
    const [reorderedItem] = exercises.splice(result.source.index, 1)
    exercises.splice(result.destination.index, 0, reorderedItem)

    setSuperset({ ...superset, exercises })
  }

  const calculateTotalVolume = () => {
    return superset.exercises.reduce((total, exercise) => {
      const sets = exercise.sets
      const reps = parseInt(exercise.reps) || 0
      const weight = parseFloat(exercise.weight) || 0
      return total + (sets * reps * weight)
    }, 0)
  }

  const calculateEstimatedDuration = () => {
    const exerciseTime = superset.exercises.reduce((total, exercise) => {
      return total + (exercise.sets * (parseInt(exercise.reps) || 0) * 3) // Assuming 3 seconds per rep
    }, 0)
    const restTime = (superset.exercises.length - 1) * superset.restBetweenExercises * superset.rounds
    const totalRestTime = superset.restAfterSuperset * (superset.rounds - 1)
    return (exerciseTime + restTime + totalRestTime) / 60 // Convert to minutes
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Create Superset</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Create Superset</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>A superset is a form of strength training in which you move quickly from one exercise to a separate exercise without taking a break between the two exercises.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[calc(90vh-4rem)]">
          <div className="space-y-6 p-4">
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="exercises">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {superset.exercises.map((exercise, index) => (
                      <Draggable key={exercise.id} draggableId={exercise.id} index={index}>
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="mb-4"
                          >
                            <CardHeader className="flex flex-row items-center">
                              <div {...provided.dragHandleProps}>
                                <GripVertical className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <CardTitle className="flex-1">
                                {index === 0 ? 'Primary Exercise' : `Secondary Exercise ${index}`}
                              </CardTitle>
                              {index !== 0 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeExercise(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor={`exercise-${index}`}>Exercise</Label>
                                <Select
                                  value={exercise.name}
                                  onValueChange={(value) => updateExercise(index, 'name', value)}
                                >
                                  <SelectTrigger id={`exercise-${index}`}>
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
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`sets-${index}`}>Sets</Label>
                                  <Input
                                    id={`sets-${index}`}
                                    type="number"
                                    value={exercise.sets}
                                    onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value))}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`reps-${index}`}>Reps</Label>
                                  <Input
                                    id={`reps-${index}`}
                                    value={exercise.reps}
                                    onChange={(e) => updateExercise(index, 'reps', e.target.value)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`weight-${index}`}>Weight/Intensity</Label>
                                  <Input
                                    id={`weight-${index}`}
                                    value={exercise.weight}
                                    onChange={(e) => updateExercise(index, 'weight', e.target.value)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`rpe-${index}`}>RPE Target</Label>
                                  <Slider
                                    id={`rpe-${index}`}
                                    min={1}
                                    max={10}
                                    step={1}
                                    value={[exercise.rpe]}
                                    onValueChange={(value) => updateExercise(index, 'rpe', value[0])}
                                  />
                                  <div className="text-center">RPE {exercise.rpe}</div>
                                </div>
                              </div>
                              <Accordion type="single" collapsible>
                                <AccordionItem value="additional-options">
                                  <AccordionTrigger>Additional Options</AccordionTrigger>
                                  <AccordionContent>
                                    <div className="space-y-4">
                                      <div className="space-y-2">
                                        <Label htmlFor={`form-cues-${index}`}>Form Cues</Label>
                                        <Textarea
                                          id={`form-cues-${index}`}
                                          value={exercise.formCues}
                                          onChange={(e) => updateExercise(index, 'formCues', e.target.value)}
                                          placeholder="Enter form cues for this exercise"
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor={`alternatives-${index}`}>Alternative Exercises</Label>
                                        <Textarea
                                          id={`alternatives-${index}`}
                                          value={exercise.alternatives.join(', ')}
                                          onChange={(e) => updateExercise(index, 'alternatives', e.target.value.split(', '))}
                                          placeholder="Enter alternative exercises, separated by commas"
                                        />
                                      </div>
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            <Button onClick={addExercise}>
              <Plus className="mr-2 h-4 w-4" />
              Add Exercise
            </Button>

            <Card>
              <CardHeader>
                <CardTitle>Superset Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rest-between">Rest Between Exercises (seconds)</Label>
                    <Input
                      id="rest-between"
                      type="number"
                      value={superset.restBetweenExercises}
                      onChange={(e) => setSuperset({ ...superset, restBetweenExercises: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rest-after">Rest After Superset (seconds)</Label>
                    <Input
                      id="rest-after"
                      type="number"
                      value={superset.restAfterSuperset}
                      onChange={(e) => setSuperset({ ...superset, restAfterSuperset: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rounds">Number of Rounds</Label>
                    <Input
                      id="rounds"
                      type="number"
                      value={superset.rounds}
                      onChange={(e) => setSuperset({ ...superset, rounds: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time-goal">Time Goal (minutes)</Label>
                    <Input
                      id="time-goal"
                      type="number"
                      value={superset.timeGoal}
                      onChange={(e) => setSuperset({ ...superset, timeGoal: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="progression">Progression Pattern</Label>
                  <Textarea
                    id="progression"
                    value={superset.progressionPattern}
                    onChange={(e) => setSuperset({ ...superset, progressionPattern: e.target.value })}
                    placeholder="Describe the progression pattern for this superset"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes/Instructions</Label>
                  <Textarea
                    id="notes"
                    value={superset.notes}
                    onChange={(e) => setSuperset({ ...superset, notes: e.target.value })}
                    placeholder="Enter any additional notes or instructions for this superset"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tracking-metrics">Tracking Metrics</Label>
                  <Textarea
                    id="tracking-metrics"
                    value={superset.trackingMetrics.join(', ')}
                    onChange={(e) => setSuperset({ ...superset, trackingMetrics: e.target.value.split(', ') })}
                    placeholder="Enter tracking metrics, separated by commas"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Exercises:</strong> {superset.exercises.map(e => e.name).join(' → ')}</p>
                  <p><strong>Rounds:</strong> {superset.rounds}</p>
                  <p><strong>Rest Between Exercises:</strong> {superset.restBetweenExercises} seconds</p>
                  <p><strong>Rest After Superset:</strong> {superset.restAfterSuperset} seconds</p>
                  <p><strong>Estimated Duration:</strong> {calculateEstimatedDuration().toFixed(2)} minutes</p>
                  <p><strong>Total Volume:</strong> {calculateTotalVolume().toFixed(2)} (weight * reps * sets)</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}