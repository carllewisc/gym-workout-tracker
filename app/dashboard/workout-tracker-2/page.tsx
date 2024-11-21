"use client"

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Toast } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"
import { ChevronDown, ChevronUp, X, Dumbbell, Clock, Copy, Trash2, Zap, Plus, Minus } from 'lucide-react'

type Set = {
  id: string
  number: number
  weight: number
  reps: number
  isWarmup: boolean
  restTime: number
}

type ExerciseSetTrackerProps = {
  exerciseName: string
  muscleGroup: string
  onRemoveExercise: () => void
  isMetric: boolean
  previousWorkout?: {
    sets: { weight: number; reps: number }[]
  }
}

const ExerciseSetTracker: React.FC<ExerciseSetTrackerProps> = ({
                                                                 exerciseName,
                                                                 muscleGroup,
                                                                 onRemoveExercise,
                                                                 isMetric,
                                                                 previousWorkout
                                                               }) => {
  const [sets, setSets] = useState<Set[]>([{ id: '1', number: 1, weight: 0, reps: 0, isWarmup: false, restTime: 90 }])
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activeRestTimer, setActiveRestTimer] = useState<string | null>(null)
  const [restTimeRemaining, setRestTimeRemaining] = useState<number>(0)
  const { toast } = useToast()
  const lastInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (lastInputRef.current) {
      lastInputRef.current.focus()
    }
  }, [sets])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (activeRestTimer) {
      interval = setInterval(() => {
        setRestTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            setActiveRestTimer(null)
            toast({
              title: "Rest Time Complete",
              description: `Time to start your next set of ${exerciseName}!`,
            })
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [activeRestTimer, exerciseName, toast])

  const handleAddSet = () => {
    const newSet: Set = {
      id: Date.now().toString(),
      number: sets.length + 1,
      weight: sets[sets.length - 1].weight,
      reps: sets[sets.length - 1].reps,
      isWarmup: false,
      restTime: sets[sets.length - 1].restTime
    }
    setSets([...sets, newSet])
  }

  const handleUpdateSet = (id: string, field: keyof Set, value: number | boolean) => {
    setSets(sets.map(set =>
      set.id === id ? { ...set, [field]: value } : set
    ))
  }

  const handleCopyPreviousSet = (index: number) => {
    if (index > 0) {
      const previousSet = sets[index - 1]
      setSets(sets.map((set, idx) =>
        idx === index ? { ...set, weight: previousSet.weight, reps: previousSet.reps } : set
      ))
    }
  }

  const handleDeleteSet = (id: string) => {
    setSets(sets.filter(set => set.id !== id).map((set, index) => ({ ...set, number: index + 1 })))
  }

  const handleToggleWarmup = (id: string) => {
    setSets(sets.map(set =>
      set.id === id ? { ...set, isWarmup: !set.isWarmup } : set
    ))
  }

  const startRestTimer = (id: string) => {
    const set = sets.find(s => s.id === id)
    if (set) {
      setActiveRestTimer(id)
      setRestTimeRemaining(set.restTime)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Card className="mb-4">
      <Collapsible open={!isCollapsed} onOpenChange={setIsCollapsed}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold flex items-center">
            <Dumbbell className="mr-2 h-6 w-6 text-[#E5BA73]" />
            {exerciseName}
            <span className="ml-2 text-sm font-normal text-muted-foreground">({muscleGroup})</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <Button variant="ghost" size="sm" onClick={onRemoveExercise}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
            <div className="space-y-2">
              {sets.map((set, index) => (
                <div key={set.id} className="flex items-center space-x-2 p-2 bg-muted rounded-md">
                  <span className="w-8 text-center font-medium">{set.number}</span>
                  <div className="flex-1 flex items-center space-x-2">
                    <div className="flex-1">
                      <Label htmlFor={`weight-${set.id}`} className="sr-only">Weight</Label>
                      <div className="flex items-center">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-r-none"
                          onClick={() => handleUpdateSet(set.id, 'weight', set.weight - (isMetric ? 2.5 : 5))}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          id={`weight-${set.id}`}
                          type="number"
                          value={set.weight}
                          onChange={(e) => handleUpdateSet(set.id, 'weight', Number(e.target.value))}
                          className="w-16 rounded-none text-center"
                          placeholder={previousWorkout?.sets[index]?.weight.toString()}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-l-none"
                          onClick={() => handleUpdateSet(set.id, 'weight', set.weight + (isMetric ? 2.5 : 5))}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex-1">
                      <Label htmlFor={`reps-${set.id}`} className="sr-only">Reps</Label>
                      <div className="flex items-center">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-r-none"
                          onClick={() => handleUpdateSet(set.id, 'reps', set.reps - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          id={`reps-${set.id}`}
                          type="number"
                          value={set.reps}
                          onChange={(e) => handleUpdateSet(set.id, 'reps', Number(e.target.value))}
                          className="w-16 rounded-none text-center"
                          placeholder={previousWorkout?.sets[index]?.reps.toString()}
                          ref={index === sets.length - 1 ? lastInputRef : null}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-l-none"
                          onClick={() => handleUpdateSet(set.id, 'reps', set.reps + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => startRestTimer(set.id)}
                    >
                      <Clock className="h-4 w-4" />
                    </Button>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleCopyPreviousSet(index)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDeleteSet(set.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={set.isWarmup ? "secondary" : "ghost"}
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleToggleWarmup(set.id)}
                      >
                        <Zap className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {activeRestTimer === set.id && (
                    <div className="text-sm font-medium text-[#E5BA73]">
                      {formatTime(restTimeRemaining)}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <Button onClick={handleAddSet} className="mt-4 w-full">
              <Plus className="mr-2 h-4 w-4" /> Add Set
            </Button>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}

export default ExerciseSetTracker