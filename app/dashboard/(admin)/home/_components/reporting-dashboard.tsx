'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useToast } from '@/hooks/use-toast';
import { addDays, format } from 'date-fns';
import { CalendarIcon, Download, LineChartIcon, BarChartIcon, PieChartIcon, Loader2 } from 'lucide-react';
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from 'recharts';

// Mock data for the charts
const dailyActiveUsersData = [
  { date: '2024-03-01', users: 1200 },
  { date: '2024-03-02', users: 1300 },
  { date: '2024-03-03', users: 1100 },
  { date: '2024-03-04', users: 1400 },
  { date: '2024-03-05', users: 1600 },
  { date: '2024-03-06', users: 1500 },
  { date: '2024-03-07', users: 1700 }
];

const newUserRegistrationsData = [
  { date: '2024-03-01', users: 50 },
  { date: '2024-03-02', users: 45 },
  { date: '2024-03-03', users: 60 },
  { date: '2024-03-04', users: 55 },
  { date: '2024-03-05', users: 70 },
  { date: '2024-03-06', users: 65 },
  { date: '2024-03-07', users: 80 }
];

const userRetentionData = [
  { week: 'Week 1', retention: 100 },
  { week: 'Week 2', retention: 80 },
  { week: 'Week 3', retention: 70 },
  { week: 'Week 4', retention: 65 },
  { week: 'Week 5', retention: 60 },
  { week: 'Week 6', retention: 58 },
  { week: 'Week 7', retention: 55 },
  { week: 'Week 8', retention: 53 }
];

const workoutCompletionData = [
  { status: 'Completed', value: 75 },
  { status: 'Partial', value: 15 },
  { status: 'Abandoned', value: 10 }
];

const popularExercisesData = [
  { name: 'Bench Press', count: 1200 },
  { name: 'Squats', count: 1100 },
  { name: 'Deadlifts', count: 1000 },
  { name: 'Pull-ups', count: 900 },
  { name: 'Shoulder Press', count: 800 }
];

const muscleGroupUsageData = [
  { group: 'Chest', percentage: 25 },
  { group: 'Legs', percentage: 30 },
  { group: 'Back', percentage: 20 },
  { group: 'Shoulders', percentage: 15 },
  { group: 'Arms', percentage: 10 }
];

const equipmentUtilizationData = [
  { equipment: 'Barbell', usage: 35 },
  { equipment: 'Dumbbells', usage: 30 },
  { equipment: 'Machines', usage: 20 },
  { equipment: 'Bodyweight', usage: 10 },
  { equipment: 'Kettlebells', usage: 5 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function ReportingDashboard() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: addDays(new Date(), -7),
    to: new Date()
  });

  const handleExport = (format: string) => {
    setIsLoading(true);
    // Simulating an export process
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: 'Export Successful',
        description: `Report exported in ${format.toUpperCase()} format.`
      });
    }, 2000);
  };

  return (
    <div className="container mx-auto space-y-4 p-4">
      <h1 className="text-3xl font-bold">Reporting Dashboard</h1>

      <div className="flex items-center justify-between">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, 'LLL dd, y')} - {format(dateRange.to, 'LLL dd, y')}
                  </>
                ) : (
                  format(dateRange.from, 'LLL dd, y')
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => handleExport('csv')} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            Export CSV
          </Button>
          <Button variant="outline" onClick={() => handleExport('pdf')} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            Export PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Active Users</CardTitle>
            <LineChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10,482</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workouts Completed</CardTitle>
            <BarChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23,756</div>
            <p className="text-xs text-muted-foreground">+15.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume Lifted</CardTitle>
            <LineChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2M kg</div>
            <p className="text-xs text-muted-foreground">+12.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Engagement Rate</CardTitle>
            <PieChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68.7%</div>
            <p className="text-xs text-muted-foreground">+5.4% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="usage" className="space-y-4">
        <TabsList>
          <TabsTrigger value="usage">Usage Analytics</TabsTrigger>
          <TabsTrigger value="exercise">Exercise Analytics</TabsTrigger>
          <TabsTrigger value="behavior">User Behavior</TabsTrigger>
        </TabsList>
        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Active Users</CardTitle>
              <CardDescription>Number of active users per day</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <ChartContainer
                config={{
                  users: {
                    label: 'Active Users',
                    color: 'hsl(var(--chart-1))'
                  }
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyActiveUsersData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="users" stroke="var(--color-users)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>New User Registrations</CardTitle>
                <CardDescription>Daily new user sign-ups</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    users: {
                      label: 'New Users',
                      color: 'hsl(var(--chart-2))'
                    }
                  }}
                  className="h-[200px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={newUserRegistrationsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="users" fill="var(--color-users)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>User Retention</CardTitle>
                <CardDescription>Weekly user retention rate</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    retention: {
                      label: 'Retention Rate',
                      color: 'hsl(var(--chart-3))'
                    }
                  }}
                  className="h-[200px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={userRetentionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="retention" stroke="var(--color-retention)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Workout Completion Rates</CardTitle>
              <CardDescription>Distribution of workout completion status</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  value: {
                    label: 'Percentage',
                    color: 'hsl(var(--chart-4))'
                  }
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={workoutCompletionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {workoutCompletionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="exercise" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Most Popular Exercises</CardTitle>
                <CardDescription>Top 5 most performed exercises</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    count: {
                      label: 'Usage Count',
                      color: 'hsl(var(--chart-5))'
                    }
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={popularExercisesData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="var(--color-count)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Usage by Muscle Group</CardTitle>
                <CardDescription>Distribution of exercises by muscle group</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    percentage: {
                      label: 'Usage Percentage',
                      color: 'hsl(var(--chart-6))'
                    }
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={muscleGroupUsageData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="percentage"
                      >
                        {muscleGroupUsageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Equipment Utilization</CardTitle>
              <CardDescription>Usage percentage of different equipment types</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  usage: {
                    label: 'Usage Percentage',
                    color: 'hsl(var(--chart-7))'
                  }
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={equipmentUtilizationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="equipment" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="usage" fill="var(--color-usage)">
                      {equipmentUtilizationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="behavior" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Behavior Analytics</CardTitle>
              <CardDescription>Insights into user patterns and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="mb-2 text-sm font-medium">Session Frequency</h4>
                  <p className="text-sm text-muted-foreground">On average, users log in 4.2 times per week.</p>
                </div>
                <div>
                  <h4 className="mb-2 text-sm font-medium">Workout Patterns</h4>
                  <p className="text-sm text-muted-foreground">Most popular workout days: Monday, Wednesday, Friday</p>
                </div>
                <div>
                  <h4 className="mb-2 text-sm font-medium">Feature Usage</h4>
                  <p className="text-sm text-muted-foreground">
                    Top features: Workout Tracker, Progress Charts, Exercise Library
                  </p>
                </div>
                <div>
                  <h4 className="mb-2 text-sm font-medium">Device/Platform Stats</h4>
                  <p className="text-sm text-muted-foreground">Mobile: 65%, Desktop: 30%, Tablet: 5%</p>
                </div>
                <div>
                  <h4 className="mb-2 text-sm font-medium">User Feedback Summary</h4>
                  <p className="text-sm text-muted-foreground">Average rating: 4.7/5 stars</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Custom Report Builder</CardTitle>
          <CardDescription>Create and schedule custom reports</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="reportName" className="text-sm font-medium">
                Report Name
              </label>
              <input id="reportName" className="w-full rounded border p-2" placeholder="Enter report name" />
            </div>
            <div className="space-y-2">
              <label htmlFor="schedule" className="text-sm font-medium">
                Schedule
              </label>
              <Select>
                <SelectTrigger id="schedule">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Metrics to Include</label>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox" />
                <span>Active Users</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox" />
                <span>Workout Completions</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox" />
                <span>New Registrations</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox" />
                <span>User Retention</span>
              </label>
            </div>
          </div>
          <Button className="w-full">Create Custom Report</Button>
        </CardContent>
      </Card>
    </div>
  );
}
