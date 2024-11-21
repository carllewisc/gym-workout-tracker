"use client"

import { useState } from 'react'
import { ArrowDown, ArrowUp, Dumbbell, Flame } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, Cell } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Mock data
const weightProgressData = [
  { date: '2023-01-01', Squat: 200, Deadlift: 250, Bench: 150 },
  { date: '2023-02-01', Squat: 220, Deadlift: 270, Bench: 160 },
  { date: '2023-03-01', Squat: 230, Deadlift: 290, Bench: 170 },
  { date: '2023-04-01', Squat: 240, Deadlift: 300, Bench: 175 },
  { date: '2023-05-01', Squat: 250, Deadlift: 315, Bench: 180 },
]

const muscleHeatmapData = [
  { muscle: 'Chest', frequency: 0.8 },
  { muscle: 'Back', frequency: 0.9 },
  { muscle: 'Legs', frequency: 0.7 },
  { muscle: 'Shoulders', frequency: 0.6 },
  { muscle: 'Arms', frequency: 0.5 },
  { muscle: 'Core', frequency: 0.4 },
]

const weeklyVolumeData = [
  { week: 'Week 1', Chest: 5000, Back: 6000, Legs: 8000, Shoulders: 3000, Arms: 2000, Core: 1000 },
  { week: 'Week 2', Chest: 5500, Back: 6200, Legs: 8500, Shoulders: 3200, Arms: 2200, Core: 1100 },
  { week: 'Week 3', Chest: 5200, Back: 6500, Legs: 9000, Shoulders: 3400, Arms: 2400, Core: 1200 },
  { week: 'Week 4', Chest: 5800, Back: 6800, Legs: 9500, Shoulders: 3600, Arms: 2600, Core: 1300 },
]

const personalRecordsData = [
  { exercise: 'Squat', weight: 250, date: '2023-05-15', previous: 240 },
  { exercise: 'Deadlift', weight: 315, date: '2023-05-10', previous: 305 },
  { exercise: 'Bench Press', weight: 180, date: '2023-05-05', previous: 175 },
  { exercise: 'Overhead Press', weight: 135, date: '2023-05-01', previous: 130 },
]

export default function WorkoutDashboard() {
  const [selectedExercise, setSelectedExercise] = useState('Squat')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Simulating data fetching
  const fetchData = () => {
    setIsLoading(true)
    setError(null)
    // Simulating API call
    setTimeout(() => {
      // Randomly decide if there's an error
      if (Math.random() > 0.8) {
        setError('Failed to fetch data. Please try again.')
      }
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Workout Analytics Dashboard</h1>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Weight Lifted</CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24,500 lbs</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 inline-flex items-center">
                <ArrowUp className="w-3 h-3 mr-1" />
                12%
              </span>{" "}
              vs last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workouts Completed</CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">16</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Trained Muscle</CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Back</div>
            <p className="text-xs text-muted-foreground">5 sessions this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7 days</div>
            <p className="text-xs text-muted-foreground">Keep it up!</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Charts and Muscle Focus Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Weight Progression</CardTitle>
            <Select
              value={selectedExercise}
              onValueChange={setSelectedExercise}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select exercise" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Squat">Squat</SelectItem>
                <SelectItem value="Deadlift">Deadlift</SelectItem>
                <SelectItem value="Bench">Bench Press</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                [selectedExercise]: {
                  label: selectedExercise,
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightProgressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey={selectedExercise}
                    stroke="var(--color-chart-1)"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Muscle Focus Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={muscleHeatmapData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 1]} />
                  <YAxis dataKey="muscle" type="category" />
                  <Tooltip />
                  <Bar dataKey="frequency" fill="#8884d8">
                    {muscleHeatmapData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`rgb(66, 86, 244, ${entry.frequency})`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Volume Overview and Personal Records */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Volume Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                Chest: {
                  label: "Chest",
                  color: "hsl(var(--chart-1))",
                },
                Back: {
                  label: "Back",
                  color: "hsl(var(--chart-2))",
                },
                Legs: {
                  label: "Legs",
                  color: "hsl(var(--chart-3))",
                },
                Shoulders: {
                  label: "Shoulders",
                  color: "hsl(var(--chart-4))",
                },
                Arms: {
                  label: "Arms",
                  color: "hsl(var(--chart-5))",
                },
                Core: {
                  label: "Core",
                  color: "hsl(var(--chart-6))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyVolumeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="Chest" stackId="a" fill="var(--color-chart-1)" />
                  <Bar dataKey="Back" stackId="a" fill="var(--color-chart-2)" />
                  <Bar dataKey="Legs" stackId="a" fill="var(--color-chart-3)" />
                  <Bar dataKey="Shoulders" stackId="a" fill="var(--color-chart-4)" />
                  <Bar dataKey="Arms" stackId="a" fill="var(--color-chart-5)" />
                  <Bar dataKey="Core" stackId="a" fill="var(--color-chart-6)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
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
                  <TableHead>Exercise</TableHead>
                  <TableHead>Weight (lbs)</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Previous (lbs)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {personalRecordsData.map((record) => (
                  <TableRow key={record.exercise}>
                    <TableCell>{record.exercise}</TableCell>
                    <TableCell>{record.weight}</TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.previous}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Loading and Error States */}
      <div className="flex justify-center mt-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          onClick={fetchData}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Refresh Data'}
        </button>
      </div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
    </div>
  )
}