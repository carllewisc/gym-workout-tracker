"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { Search, Plus } from 'lucide-react'

// Mock data for training plans
const trainingPlans = [
  {
    id: 1,
    name: "Beginner Strength Training",
    duration: 8,
    difficulty: "Beginner",
    description: "A comprehensive strength program for beginners focusing on the main compound lifts."
  },
  {
    id: 2,
    name: "Intermediate Hypertrophy",
    duration: 12,
    difficulty: "Intermediate",
    description: "Build muscle mass with this hypertrophy-focused program for intermediate lifters."
  },
  {
    id: 3,
    name: "Advanced Powerlifting",
    duration: 16,
    difficulty: "Advanced",
    description: "Prepare for your next powerlifting meet with this intense, advanced program."
  },
  {
    id: 4,
    name: "Fat Loss and Conditioning",
    duration: 6,
    difficulty: "Beginner",
    description: "A high-intensity program designed for fat loss and improving overall conditioning."
  },
  {
    id: 5,
    name: "Bodyweight Mastery",
    duration: 10,
    difficulty: "Intermediate",
    description: "Master bodyweight exercises and improve your strength-to-weight ratio."
  }
]

export default function Page() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState("")
  const [durationFilter, setDurationFilter] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleCreatePlan = () => {
    toast({
      title: "Create New Plan",
      description: "Redirecting to plan creation page...",
    })
    // Implement redirection or modal opening logic here
  }

  const handleViewPlan = (planId: number) => {
    toast({
      title: "View Plan",
      description: `Viewing plan with ID: ${planId}`,
    })
    // Implement view plan logic here
  }

  const handleStartPlan = (planId: number) => {
    toast({
      title: "Start Plan",
      description: `Starting plan with ID: ${planId}`,
    })
    // Implement start plan logic here
  }

  const filteredPlans = trainingPlans.filter(plan =>
    plan.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (difficultyFilter === "" || plan.difficulty === difficultyFilter) &&
    (durationFilter === "" || plan.duration <= parseInt(durationFilter))
  )

  return (
    <div className="container mx-auto p-4 space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Training Plans</h1>
        <Button onClick={handleCreatePlan}>
          <Plus className="mr-2 h-4 w-4" />
          Create Plan
        </Button>
      </header>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="Search plans..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Difficulties</SelectItem>
            <SelectItem value="Beginner">Beginner</SelectItem>
            <SelectItem value="Intermediate">Intermediate</SelectItem>
            <SelectItem value="Advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
        <Select value={durationFilter} onValueChange={setDurationFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Max Duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any Duration</SelectItem>
            <SelectItem value="4">4 weeks or less</SelectItem>
            <SelectItem value="8">8 weeks or less</SelectItem>
            <SelectItem value="12">12 weeks or less</SelectItem>
            <SelectItem value="16">16 weeks or less</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="flex flex-col justify-between">
              <CardHeader>
                <Skeleton className="h-6 w-2/3 mb-2" />
                <Skeleton className="h-4 w-1/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6" />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </CardFooter>
            </Card>
          ))
        ) : filteredPlans.length > 0 ? (
          filteredPlans.map(plan => (
            <Card key={plan.id} className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.duration} weeks • {plan.difficulty}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => handleViewPlan(plan.id)}>View</Button>
                <Button onClick={() => handleStartPlan(plan.id)}>Start</Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-muted-foreground">No training plans found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}