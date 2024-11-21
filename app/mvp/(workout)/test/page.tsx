'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';

// Mock data - replace with API call
const exercises = [
  { id: 1, name: 'Bench Press', muscle: 'Chest', frequency: 10 },
  { id: 2, name: 'Squat', muscle: 'Legs', frequency: 15 },
  { id: 3, name: 'Deadlift', muscle: 'Back', frequency: 12 }
];

const progressData = [
  { date: '2023-04-30', weight: 95, reps: 5, notes: 'First session' },
  { date: '2023-05-07', weight: 103, reps: 5 },
  { date: '2023-05-14', weight: 110, reps: 5, notes: 'PR attempt' },
  { date: '2023-05-21', weight: 110, reps: 6 },
  { date: '2023-05-28', weight: 115, reps: 5 },
  { date: '2023-06-04', weight: 115, reps: 5 },
  { date: '2023-06-11', weight: 125, reps: 4, notes: 'New PR!' }
];

export default function WorkoutAnalytics() {
  const [dateRange, setDateRange] = React.useState('3m');
  const [open, setOpen] = React.useState(false);
  const [selectedExercise, setSelectedExercise] = React.useState('');

  const stats = {
    startingWeight: progressData[0].weight,
    currentWeight: progressData[progressData.length - 1].weight,
    improvement: progressData[progressData.length - 1].weight - progressData[0].weight,
    bestSession: Math.max(...progressData.map((d) => d.weight))
  };

  return (
    <div className="container mx-auto space-y-8 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Workout Analytics</h1>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1m">Last month</SelectItem>
            <SelectItem value="3m">Last 3 months</SelectItem>
            <SelectItem value="6m">Last 6 months</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
          <TabsTrigger value="volume" disabled>
            Volume Analysis (Coming Soon)
          </TabsTrigger>
          <TabsTrigger value="performance" disabled>
            Performance (Coming Soon)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Overview Content</CardTitle>
            </CardHeader>
            <CardContent>Overview dashboard coming soon...</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <Card className="relative">
            <CardHeader className="flex flex-row items-center justify-between">
              {/* ... (previous header content remains the same) */}
            </CardHeader>
            <CardContent className="h-[400px]">
              <ChartContainer
                config={{
                  weight: {
                    label: "Weight",
                    color: "#E5BA73",
                  }
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progressData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) => format(new Date(date), "MMM d")}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      label={{ value: "Weight (kg)", angle: -90, position: "insideLeft" }}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <ChartTooltip>
                              <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="font-medium">Date:</span>
                                  <span>{format(new Date(data.date), "MMM d, yyyy")}</span>
                                </div>
                                <div className="flex items-center justify-between gap-2">
                                  <span className="font-medium">Weight:</span>
                                  <span>{data.weight}kg</span>
                                </div>
                                <div className="flex items-center justify-between gap-2">
                                  <span className="font-medium">Reps:</span>
                                  <span>{data.reps}</span>
                                </div>
                                {data.notes && (
                                  <div className="border-t pt-2 mt-2">
                                    <span className="text-sm text-muted-foreground">{data.notes}</span>
                                  </div>
                                )}
                              </div>
                            </ChartTooltip>
                          )
                        }
                        return null
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="var(--color-weight)"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "var(--color-weight)" }}
                      activeDot={{ r: 6, fill: "var(--color-weight)" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Starting Weight</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.startingWeight}kg</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Current Weight</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.currentWeight}kg</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Improvement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#E5BA73]">+{stats.improvement}kg</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Best Session</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.bestSession}kg</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
