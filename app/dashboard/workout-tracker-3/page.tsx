"use client"

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { Search, X, Star, ChevronDown, Dumbbell, Heart } from 'lucide-react'

// Mock data for exercises
const exerciseData = {
  "Chest": [
    { id: "bench-press", name: "Bench Press", lastWeight: 80, lastReps: 8 },
    { id: "incline-press", name: "Incline Press", lastWeight: 60, lastReps: 10 },
    { id: "chest-flyes", name: "Chest Flyes", lastWeight: 15, lastReps: 12 },
  ],
  "Back": [
    { id: "pull-ups", name: "Pull-ups", lastWeight: 0, lastReps: 10 },
    { id: "rows", name: "Rows", lastWeight: 70, lastReps: 8 },
    { id: "lat-pulldowns", name: "Lat Pulldowns", lastWeight: 60, lastReps: 10 },
  ],
  "Legs": [
    { id: "squats", name: "Squats", lastWeight: 100, lastReps: 8 },
    { id: "deadlifts", name: "Deadlifts", lastWeight: 120, lastReps: 6 },
    { id: "leg-press", name: "Leg Press", lastWeight: 150, lastReps: 10 },
  ],
  "Shoulders": [
    { id: "overhead-press", name: "Overhead Press", lastWeight: 50, lastReps: 8 },
    { id: "lateral-raises", name: "Lateral Raises", lastWeight: 10, lastReps: 12 },
    { id: "front-raises", name: "Front Raises", lastWeight: 10, lastReps: 12 },
  ],
  "Arms": [
    { id: "bicep-curls", name: "Bicep Curls", lastWeight: 20, lastReps: 10 },
    { id: "tricep-extensions", name: "Tricep Extensions", lastWeight: 25, lastReps: 10 },
    { id: "hammer-curls", name: "Hammer Curls", lastWeight: 15, lastReps: 12 },
  ],
  "Core": [
    { id: "crunches", name: "Crunches", lastWeight: 0, lastReps: 20 },
    { id: "planks", name: "Planks", lastWeight: 0, lastReps: 60 },
    { id: "russian-twists", name: "Russian Twists", lastWeight: 10, lastReps: 20 },
  ],
}

type Exercise = {
  id: string
  name: string
  lastWeight: number
  lastReps: number
}

type ExerciseSelectionProps = {
  onSelectExercise: (exercise: Exercise) => void
}

const ExerciseSelection: React.FC<ExerciseSelectionProps> = ({ onSelectExercise }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string | null>(null)
  const [recentExercises, setRecentExercises] = useState<Exercise[]>([])
  const [favoriteExercises, setFavoriteExercises] = useState<Exercise[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchExercises = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        // In a real app, you would fetch this data from an API
        setRecentExercises([
          exerciseData.Chest[0],
          exerciseData.Back[0],
          exerciseData.Legs[0],
        ])
        setFavoriteExercises([
          exerciseData.Chest[1],
          exerciseData.Back[1],
          exerciseData.Legs[1],
        ])
        setIsLoading(false)
      } catch (err) {
        setError("Failed to load exercises. Please try again.")
        setIsLoading(false)
      }
    }
    fetchExercises()
  }, [])

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    // Reset muscle group filter when searching
    setSelectedMuscleGroup(null)
  }

  const handleClearSearch = () => {
    setSearchTerm("")
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }

  const handleSelectMuscleGroup = (group: string) => {
    setSelectedMuscleGroup(group === selectedMuscleGroup ? null : group)
    setSearchTerm("")
  }

  const handleSelectExercise = (exercise: Exercise) => {
    onSelectExercise(exercise)
    // Add to recent exercises
    setRecentExercises(prev => [exercise, ...prev.filter(e => e.id !== exercise.id)].slice(0, 5))
  }

  const toggleFavorite = (exercise: Exercise) => {
    setFavoriteExercises(prev =>
      prev.some(e => e.id === exercise.id)
        ? prev.filter(e => e.id !== exercise.id)
        : [...prev, exercise]
    )
    toast({
      title: prev.some(e => e.id === exercise.id) ? "Removed from favorites" : "Added to favorites",
      description: exercise.name,
    })
  }

  const filteredExercises = Object.entries(exerciseData).reduce((acc, [group, exercises]) => {
    const filtered = exercises.filter(exercise =>
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!selectedMuscleGroup || selectedMuscleGroup === group)
    )
    if (filtered.length > 0) {
      acc[group] = filtered
    }
    return acc
  }, {} as Record<string, Exercise[]>)

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Exercise Selection</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-8"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={handleClearSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Button
            variant={selectedMuscleGroup ? "secondary" : "outline"}
            onClick={() => handleSelectMuscleGroup(selectedMuscleGroup || "Chest")}
          >
            {selectedMuscleGroup || "Filter"}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="quick-access" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="quick-access">Quick Access</TabsTrigger>
            <TabsTrigger value="browse">Browse</TabsTrigger>
          </TabsList>
          <TabsContent value="quick-access">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Recent Exercises</h3>
                <ScrollArea className="h-[100px] w-full whitespace-nowrap rounded-md border">
                  <div className="flex p-4 space-x-4">
                    {isLoading ? (
                      Array(3).fill(0).map((_, i) => (
                        <Skeleton key={i} className="w-[100px] h-[32px] rounded-full" />
                      ))
                    ) : recentExercises.length > 0 ? (
                      recentExercises.map(exercise => (
                        <Button
                          key={exercise.id}
                          variant="outline"
                          className="flex items-center space-x-2"
                          onClick={() => handleSelectExercise(exercise)}
                        >
                          <Dumbbell className="h-4 w-4" />
                          <span>{exercise.name}</span>
                        </Button>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No recent exercises</p>
                    )}
                  </div>
                </ScrollArea>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Favorite Exercises</h3>
                <ScrollArea className="h-[100px] w-full whitespace-nowrap rounded-md border">
                  <div className="flex p-4 space-x-4">
                    {isLoading ? (
                      Array(3).fill(0).map((_, i) => (
                        <Skeleton key={i} className="w-[100px] h-[32px] rounded-full" />
                      ))
                    ) : favoriteExercises.length > 0 ? (
                      favoriteExercises.map(exercise => (
                        <Button
                          key={exercise.id}
                          variant="outline"
                          className="flex items-center space-x-2"
                          onClick={() => handleSelectExercise(exercise)}
                        >
                          <Star className="h-4 w-4 fill-yellow-400" />
                          <span>{exercise.name}</span>
                        </Button>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No favorite exercises</p>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="browse">
            {isLoading ? (
              <div className="space-y-4">
                {Array(3).fill(0).map((_, i) => (
                  <Skeleton key={i} className="w-full h-[40px]" />
                ))}
              </div>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {Object.entries(filteredExercises).map(([group, exercises]) => (
                  <AccordionItem value={group} key={group}>
                    <AccordionTrigger>{group}</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {exercises.map(exercise => (
                          <div
                            key={exercise.id}
                            className="flex items-center justify-between p-2 rounded-md hover:bg-muted"
                          >
                            <Button
                              variant="ghost"
                              className="flex-1 justify-start"
                              onClick={() => handleSelectExercise(exercise)}
                            >
                              <Dumbbell className="mr-2 h-4 w-4" />
                              <span>{exercise.name}</span>
                            </Button>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-muted-foreground">
                                {exercise.lastWeight}kg x {exercise.lastReps}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => toggleFavorite(exercise)}
                              >
                                <Heart
                                  className={`h-4 w-4 ${
                                    favoriteExercises.some(e => e.id === exercise.id)
                                      ? "fill-red-500 text-red-500"
                                      : "text-muted-foreground"
                                  }`}
                                />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default ExerciseSelection