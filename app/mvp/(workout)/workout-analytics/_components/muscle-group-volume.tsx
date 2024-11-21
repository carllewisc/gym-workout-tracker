"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LabelList } from 'recharts'
import { Info } from 'lucide-react'

// Mock data for the chart
const muscleGroupData = [
  { name: 'Chest', volume: 12500, exercises: 3, sets: 12, reps: 96, avgWeight: 78 },
  { name: 'Back', volume: 15000, exercises: 4, sets: 16, reps: 128, avgWeight: 70 },
  { name: 'Legs', volume: 20000, exercises: 5, sets: 20, reps: 160, avgWeight: 100 },
  { name: 'Shoulders', volume: 8000, exercises: 3, sets: 12, reps: 96, avgWeight: 45 },
  { name: 'Arms', volume: 6000, exercises: 4, sets: 16, reps: 128, avgWeight: 25 },
  { name: 'Core', volume: 4000, exercises: 3, sets: 12, reps: 96, avgWeight: 15 },
]

export default function MuscleGroupVolume() {
  const [data, setData] = useState(muscleGroupData)
  const [isLoading, setIsLoading] = useState(true)
  const [totalVolume, setTotalVolume] = useState(0)

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      const sortedData = [...muscleGroupData].sort((a, b) => b.volume - a.volume)
      const total = sortedData.reduce((sum, item) => sum + item.volume, 0)
      setData(sortedData.map(item => ({
        ...item,
        percentage: ((item.volume / total) * 100).toFixed(1)
      })))
      setTotalVolume(total)
      setIsLoading(false)
    }
    fetchData()
  }, [])

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-background p-4 border rounded shadow-lg">
          <p className="font-bold">{data.name}</p>
          <p>Volume: {formatNumber(data.volume)} kg</p>
          <p>Exercises: {data.exercises}</p>
          <p>Sets: {data.sets}</p>
          <p>Reps: {data.reps}</p>
          <p>Avg Weight: {data.avgWeight} kg</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">Volume by Muscle Group</CardTitle>
        <div className="flex items-center text-sm text-muted-foreground">
          <Info className="w-4 h-4 mr-1" />
          Volume = Sets x Reps x Weight
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="h-[400px] flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : data.length === 0 ? (
          <div className="h-[400px] flex items-center justify-center text-muted-foreground">
            No data available for muscle group volume
          </div>
        ) : (
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 5, right: 150, left: 20, bottom: 5 }}
              >
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="volume"
                  fill="#E5BA73"
                  background={{ fill: '#f5f5f5' }}
                  animationDuration={300}
                >
                  <LabelList
                    dataKey="volume"
                    position="right"
                    formatter={(value: number) => `${formatNumber(value)} kg (${data.find(item => item.volume === value)?.percentage}%)`}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}