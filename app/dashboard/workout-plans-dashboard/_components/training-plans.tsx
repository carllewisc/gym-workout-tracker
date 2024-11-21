"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { Search, Filter, Grid, List, ChevronDown, Star, Users, Clock, Dumbbell, BarChart, Zap } from 'lucide-react'

// Mock data for workout plans
const workoutPlans = [
  {
    id: 1,
    name: "12-Week Strength Builder",
    description: "Comprehensive strength program for intermediate lifters",
    target: "Strength",
    duration: "12 weeks",
    difficulty: "Intermediate",
    rating: 4.8,
    reviews: 156,
    users: 1200,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    name: "8-Week Hypertrophy Blast",
    description: "Intense muscle-building program for experienced lifters",
    target: "Hypertrophy",
    duration: "8 weeks",
    difficulty: "Advanced",
    rating: 4.6,
    reviews: 98,
    users: 850,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    name: "4-Week Fat Burner",
    description: "High-intensity program for rapid fat loss",
    target: "Weight Loss",
    duration: "4 weeks",
    difficulty: "Beginner",
    rating: 4.5,
    reviews: 210,
    users: 1800,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 4,
    name: "Endurance Builder",
    description: "Improve your stamina and cardiovascular health",
    target: "Endurance",
    duration: "8 weeks",
    difficulty: "Intermediate",
    rating: 4.7,
    reviews: 75,
    users: 600,
    image: "/placeholder.svg?height=200&width=300",
  },
  // Add more mock plans here...
]

export default function TrainingPlans() {
  const { toast } = useToast()
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const handleStartPlan = (planId: number) => {
    toast({
      title: "Plan Started",
      description: `You've started the plan with ID ${planId}. Good luck!`,
    })
  }

  const filteredPlans = workoutPlans.filter(plan =>
    (selectedTarget ? plan.target === selectedTarget : true) &&
    (searchTerm ? plan.name.toLowerCase().includes(searchTerm.toLowerCase()) : true)
  )

  return (
    <div className="container mx-auto p-4 space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Training Plans</h1>
        <div className="flex items-center space-x-4">
          <Tabs defaultValue="browse" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="browse">Browse Plans</TabsTrigger>
              <TabsTrigger value="my-plans">My Plans</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button>Create Plan</Button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedTarget === null ? "secondary" : "outline"}
            onClick={() => setSelectedTarget(null)}
          >
            All Plans
          </Button>
          <Button
            variant={selectedTarget === "Strength" ? "secondary" : "outline"}
            onClick={() => setSelectedTarget("Strength")}
          >
            Strength
          </Button>
          <Button
            variant={selectedTarget === "Hypertrophy" ? "secondary" : "outline"}
            onClick={() => setSelectedTarget("Hypertrophy")}
          >
            Hypertrophy
          </Button>
          <Button
            variant={selectedTarget === "Weight Loss" ? "secondary" : "outline"}
            onClick={() => setSelectedTarget("Weight Loss")}
          >
            Weight Loss
          </Button>
          <Button
            variant={selectedTarget === "Endurance" ? "secondary" : "outline"}
            onClick={() => setSelectedTarget("Endurance")}
          >
            Endurance
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                Advanced Filters
                <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="end">
              <ScrollArea className="h-[300px] p-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Duration</h4>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4">4 weeks</SelectItem>
                        <SelectItem value="8">8 weeks</SelectItem>
                        <SelectItem value="12">12 weeks</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Experience Level</h4>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Equipment Required</h4>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select equipment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                        <SelectItem value="full-gym">Full Gym</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Time per Session</h4>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                        <SelectItem value="90">90+ minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </ScrollArea>
              <Separator />
              <div className="p-4">
                <Button className="w-full">Apply Filters</Button>
              </div>
            </PopoverContent>
          </Popover>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setView('grid')}
            className={view === 'grid' ? 'bg-accent' : ''}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setView('list')}
            className={view === 'list' ? 'bg-accent' : ''}
          >
            <List className="h-4 w-4" />
          </Button>
          <Select defaultValue="popular">
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Popular</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="rating">Top Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-8"
          placeholder="Search plans..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className={`grid gap-6 ${view === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
        {filteredPlans.length > 0 ? (
          filteredPlans.map((plan) => (
            <Card key={plan.id} className={`overflow-hidden transition-all duration-200 ${view === 'grid' ? 'hover:shadow-lg' : 'hover:bg-accent'}`}>
              <div className={view === 'grid' ? '' : 'flex'}>
                <div className={view === 'grid' ? '' : 'w-1/3'}>
                  <img
                    src={plan.image}
                    alt={plan.name}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className={view === 'grid' ? '' : 'w-2/3 p-4'}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{plan.name}</CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                      </div>
                      <Badge variant="secondary">{plan.target}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" />
                        {plan.duration}
                      </div>
                      <div className="flex items-center">
                        <BarChart className="mr-1 h-4 w-4" />
                        {plan.difficulty}
                      </div>
                      <div className="flex items-center">
                        <Star className="mr-1 h-4 w-4" />
                        {plan.rating} ({plan.reviews} reviews)
                      </div>
                      <div className="flex items-center">
                        <Users className="mr-1 h-4 w-4" />
                        {plan.users} users
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Preview</Button>
                    <Button onClick={() => handleStartPlan(plan.id)}>Start Plan</Button>
                  </CardFooter>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <Dumbbell className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No plans found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search term</p>
          </div>
        )}
      </div>
    </div>
  )
}