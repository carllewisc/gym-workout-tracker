"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Dumbbell } from 'lucide-react'

// Mock data for the chart
const progressData = {
  'Bench Press': [
    { date: '2023-05-01', weight: 80, reps: 8 },
    { date: '2023-05-08', weight: 82.5, reps: 8 },
    { date: '2023-05-15', weight: 85, reps: 7 },
    { date: '2023-05-22', weight: 85, reps: 8 },
    { date: '2023-05-29', weight: 87.5, reps: 7 },
    { date: '2023-06-05', weight: 87.5, reps: 8 },
    { date: '2023-06-12', weight: 90, reps: 7 },
  ],
  'Squat': [
    { date: '2023-05-01', weight: 100, reps: 6 },
    { date: '2023-05-08', weight: 105, reps: 6 },
    { date: '2023-05-15', weight: 110, reps: 5 },
    { date: '2023-05-22', weight: 110, reps: 6 },
    { date: '2023-05-29', weight: 115, reps: 5 },
    { date: '2023-06-05', weight: 115, reps: 6 },
    { date: '2023-06-12', weight: 120, reps: 5 },
  ],
  'Deadlift': [
    { date: '2023-05-01', weight: 120, reps: 5 },
    { date: '2023-05-08', weight: 125, reps: 5 },
    { date: '2023-05-15', weight: 130, reps: 4 },
    { date: '2023-05-22', weight: 130, reps: 5 },
    { date: '2023-05-29', weight: 135, reps: 4 },
    { date: '2023-06-05', weight: 135, reps: 5 },
    { date: '2023-06-12', weight: 140, reps: 4 },
  ],
}

const exercises = Object.keys(progressData)

export default function WorkoutProgressChart() {
  const [selectedExercise, setSelectedExercise] = useState(exercises[0])
  const [isLoading, setIsLoading] = useState(false)

  const handleExerciseChange = (exercise: string) => {
    setIsLoading(true)
    setSelectedExercise(exercise)
    // Simulate API call
    setTimeout(() => setIsLoading(false), 1000)
  }

  const data = progressData[selectedExercise].map((entry, index, array) => ({
    ...entry,
    percentageChange: index > 0
      ? ((entry.weight - array[index - 1].weight) / array[index - 1].weight * 100).toFixed(2)
      : '0.00'
  }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload
      return (
        <div className="bg-background p-4 border rounded shadow-lg">
          <p className="font-bold">{new Date(label).toLocaleDateString()}</p>
          <p>Weight: {dataPoint.weight} kg</p>
          <p>Reps: {dataPoint.reps}</p>
          <p>Change: {dataPoint.percentageChange}%</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Progress Overview</CardTitle>
        <Select value={selectedExercise} onValueChange={handleExerciseChange}>
          <SelectTrigger className="w-[180px]">
            <Dumbbell className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Select exercise" />
          </SelectTrigger>
          <SelectContent>
            {exercises.map((exercise) => (
              <SelectItem key={exercise} value={exercise}>
                {exercise}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[400px] flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <ChartContainer
            config={{
              [selectedExercise]: {
                label: selectedExercise,
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[400px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => new Date(date).toLocaleDateString()}
                />
                <YAxis
                  label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft' }}
                  domain={['dataMin - 5', 'dataMax + 5']}
                />
                <ChartTooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="var(--color-chart-1)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 8 }}
                  animationDuration={300}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}