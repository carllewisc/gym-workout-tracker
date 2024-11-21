"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { useToast } from "@/hooks/use-toast"
import { Save, Eye, Plus, Trash2, Copy, Search, Star, ChevronDown, Upload, RefreshCcw } from 'lucide-react'

// Mock data for exercises
const exercisesList = [
  { id: 'e1', name: 'Barbell Squat', category: 'Legs', equipment: 'Barbell' },
  { id: 'e2', name: 'Bench Press', category: 'Chest', equipment: 'Barbell' },
  { id: 'e3', name: 'Deadlift', category: 'Back', equipment: 'Barbell' },
  { id: 'e4', name: 'Pull-ups', category: 'Back', equipment: 'Bodyweight' },
  { id: 'e5', name: 'Overhead Press', category: 'Shoulders', equipment: 'Barbell' },
]

export default function CreateTrainingPlan() {
  const { toast } = useToast()
  const [planName, setPlanName] = useState('')
  const [description, setDescription] = useState('')
  const [target, setTarget] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [duration, setDuration] = useState(4)
  const [equipment, setEquipment] = useState<string[]>([])
  const [prerequisites, setPrerequisites] = useState('')
  const [weeks, setWeeks] = useState([{ id: 'w1', description: '', days: [] }])
  const [exercises, setExercises] = useState<{ id: string; name: string; sets: number; reps: number; rest: number }[]>([])
  const [publishStatus, setPublishStatus] = useState('draft')

  const handleSaveDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Your training plan draft has been saved.",
    })
  }

  const handlePublish = () => {
    toast({
      title: "Plan Published",
      description: "Your training plan has been published successfully.",
    })
  }

  const handlePreview = () => {
    toast({
      title: "Preview Mode",
      description: "Previewing your training plan.",
    })
  }

  const addWeek = () => {
    setWeeks([...weeks, { id: `w${weeks.length + 1}`, description: '', days: [] }])
  }

  const removeWeek = (weekId: string) => {
    setWeeks(weeks.filter(week => week.id !== weekId))
  }

  const addExercise = (exercise: { id: string; name: string }) => {
    setExercises([...exercises, { ...exercise, sets: 3, reps: 10, rest: 60 }])
  }

  const removeExercise = (exerciseId: string) => {
    setExercises(exercises.filter(ex => ex.id !== exerciseId))
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return
    }

    const items = Array.from(exercises)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setExercises(items)
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Create Training Plan</h1>
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={handleSaveDraft}>
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button onClick={handlePublish}>Publish</Button>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="plan-name">Plan Name</Label>
              <Input
                id="plan-name"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                placeholder="Enter plan name"
              />
            </div>
            <div className="space-y-2">
              <Label>Cover Image</Label>
              <div className="flex items-center justify-center w-full">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                  </div>
                  <input id="dropzone-file" type="file" className="hidden" />
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter plan description"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="target">Target Category</Label>
              <Select value={target} onValueChange={setTarget}>
                <SelectTrigger id="target">
                  <SelectValue placeholder="Select target category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="strength">Strength</SelectItem>
                  <SelectItem value="hypertrophy">Hypertrophy</SelectItem>
                  <SelectItem value="weight-loss">Weight Loss</SelectItem>
                  <SelectItem value="endurance">Endurance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty Level</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger id="difficulty">
                  <SelectValue placeholder="Select difficulty level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (weeks)</Label>
              <Slider
                id="duration"
                min={1}
                max={12}
                step={1}
                value={[duration]}
                onValueChange={(value) => setDuration(value[0])}
              />
              <div className="text-center">{duration} weeks</div>
            </div>
            <div className="space-y-2">
              <Label>Required Equipment</Label>
              <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                {['Barbell', 'Dumbbells', 'Kettlebells', 'Resistance Bands', 'Pull-up Bar', 'Bench'].map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox
                      id={item}
                      checked={equipment.includes(item)}
                      onCheckedChange={(checked) => {
                        setEquipment(
                          checked
                            ? [...equipment, item]
                            : equipment.filter((i) => i !== item)
                        )
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
            <div className="space-y-2">
              <Label htmlFor="prerequisites">Prerequisites</Label>
              <Textarea
                id="prerequisites"
                value={prerequisites}
                onChange={(e) => setPrerequisites(e.target.value)}
                placeholder="Enter any prerequisites for this plan"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Program Structure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Accordion type="single" collapsible className="w-full">
              {weeks.map((week, index) => (
                <AccordionItem value={week.id} key={week.id}>
                  <AccordionTrigger>Week {index + 1}</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={`week-${week.id}-description`}>Week Description</Label>
                        <Textarea
                          id={`week-${week.id}-description`}
                          value={week.description}
                          onChange={(e) => {
                            const updatedWeeks = [...weeks]
                            updatedWeeks[index].description = e.target.value
                            setWeeks(updatedWeeks)
                          }}
                          placeholder="Enter week description and goals"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Training Days</Label>
                        <div className="grid grid-cols-7 gap-2">
                          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                            <div key={day} className="flex flex-col items-center">
                              <Checkbox id={`${week.id}-${day}`} />
                              <Label htmlFor={`${week.id}-${day}`}>{day}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => removeWeek(week.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove Week
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <Button onClick={addWeek}>
              <Plus className="mr-2 h-4 w-4" />
              Add Week
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Workout Builder</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="exercises" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="exercises">Exercises</TabsTrigger>
                <TabsTrigger value="warmup">Warm-up</TabsTrigger>
                <TabsTrigger value="cooldown">Cool-down</TabsTrigger>
              </TabsList>
              <TabsContent value="exercises">
                <div className="flex space-x-4">
                  <div className="w-1/3 border-r pr-4">
                    <div className="mb-4">
                      <Label htmlFor="exercise-search">Search Exercises</Label>
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="exercise-search"
                          className="pl-8"
                          placeholder="Search..."
                        />
                      </div>
                    </div>
                    <ScrollArea className="h-[400px]">
                      {exercisesList.map((exercise) => (
                        <div key={exercise.id} className="flex justify-between items-center p-2 hover:bg-accent">
                          <span>{exercise.name}</span>
                          <Button size="sm" onClick={() => addExercise(exercise)}>Add</Button>
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                  <div className="w-2/3">
                    <DragDropContext onDragEnd={onDragEnd}>
                      <Droppable droppableId="exercises">
                        {(provided) => (
                          <ul {...provided.droppableProps} ref={provided.innerRef}>
                            {exercises.map((exercise, index) => (
                              <Draggable key={exercise.id} draggableId={exercise.id} index={index}>
                                {(provided) => (
                                  <li
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="bg-card rounded-lg p-4 mb-2"
                                  >
                                    <div className="flex justify-between items-center mb-2">
                                      <h3 className="text-lg font-semibold">{exercise.name}</h3>
                                      <Button size="sm" variant="destructive" onClick={() => removeExercise(exercise.id)}>
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                      <div>
                                        <Label htmlFor={`sets-${exercise.id}`}>Sets</Label>
                                        <Input
                                          id={`sets-${exercise.id}`}
                                          type="number"
                                          value={exercise.sets}
                                          onChange={(e) => {
                                            const updatedExercises = [...exercises]
                                            updatedExercises[index].sets = parseInt(e.target.value)
                                            setExercises(updatedExercises)
                                          }}
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor={`reps-${exercise.id}`}>Reps</Label>
                                        <Input
                                          id={`reps-${exercise.id}`}
                                          type="number"
                                          value={exercise.reps}
                                          onChange={(e) => {
                                            const updatedExercises = [...exercises]
                                            updatedExercises[index].reps = parseInt(e.target.value)
                                            setExercises(updatedExercises)
                                          }}
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor={`rest-${exercise.id}`}>Rest (sec)</Label>
                                        <Input
                                          id={`rest-${exercise.id}`}
                                          type="number"
                                          value={exercise.rest}
                                          onChange={(e) => {
                                            const updatedExercises = [...exercises]
                                            updatedExercises[index].rest = parseInt(e.target.value)
                                            setExercises(updatedExercises)
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </li>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </ul>
                        )}
                      </Droppable>
                    </DragDropContext>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="warmup">
                <p>Warm-up templates will be added here.</p>
              </TabsContent>
              <TabsContent value="cooldown">
                <p>Cool-down templates will be added here.</p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Advanced Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="progression-rules">Progression Rules</Label>
              <Textarea
                id="progression-rules"
                placeholder="Enter progression rules"
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
              <Label htmlFor="deload-weeks">Deload Weeks</Label>
              <Input
                id="deload-weeks"
                type="number"
                placeholder="Enter deload week frequency"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="performance-targets">Performance Targets</Label>
              <Textarea
                id="performance-targets"
                placeholder="Enter performance targets"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tracking-metrics">Progress Tracking Metrics</Label>
              <Textarea
                id="tracking-metrics"
                placeholder="Enter tracking metrics"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Publishing Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="publish-status">Publish Status</Label>
              <Switch
                id="publish-status"
                checked={publishStatus === 'published'}
                onCheckedChange={(checked) => setPublishStatus(checked ? 'published' : 'draft')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="visibility">Visibility</Label>
              <Select>
                <SelectTrigger id="visibility">
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="unlisted">Unlisted</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                placeholder="Enter tags separated by commas"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="thumbnail">Thumbnail Selection</Label>
              <Select>
                <SelectTrigger id="thumbnail">
                  <SelectValue placeholder="Select thumbnail" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cover">Use Cover Image</SelectItem>
                  <SelectItem value="custom">Upload Custom Thumbnail</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={handleSaveDraft}>Save Draft</Button>
        <Button variant="outline" onClick={handlePreview}>Preview</Button>
        <Button onClick={handlePublish}>Publish</Button>
      </div>
    </div>
  )
}