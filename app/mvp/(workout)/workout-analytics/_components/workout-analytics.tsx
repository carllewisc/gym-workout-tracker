// @ts-nocheck
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Flame, Dumbbell, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { generateWorkoutMetrics } from '@/app/mvp/(workout)/_utils/generateWorkoutMetrics';

const dateRanges = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '3m', label: 'Last 3 months' }
];

const metrics = [
  {
    title: 'Total Weight Lifted',
    value: '2,450 kg',
    change: 5.2,
    icon: Dumbbell
  },
  {
    title: 'Workouts Completed',
    value: '12',
    change: -8.3,
    icon: Calendar
  },
  {
    title: 'Current Streak',
    value: '5 days',
    icon: Flame
  },
  {
    title: 'Personal Best',
    value: '120 kg',
    subtitle: 'Deadlift',
    icon: TrendingUp
  }
];

type Workout = {
  id: string;
  date: string;
  exercises: {
    name: string;
    sets: {
      weight: number;
      reps: number;
    }[];
  }[];
};

export default function WorkoutAllStats({ workouts }: { workouts: Workout[] }) {
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '3m'>('7d');
  const metrics = generateWorkoutMetrics(workouts, dateRange);
  const metricsConfig = [
    {
      title: 'Total Weight Lifted',
      value: metrics.totalWeight.value,
      change: metrics.totalWeight.change,
      icon: Dumbbell
    },
    {
      title: 'Workouts Completed',
      value: metrics.workoutsCompleted.value,
      change: metrics.workoutsCompleted.change,
      icon: Calendar
    },
    {
      title: 'Current Streak',
      value: metrics.currentStreak.value,
      icon: Flame
    },
    {
      title: 'Personal Best',
      value: metrics.personalBest.value,
      subtitle: metrics.personalBest.subtitle,
      icon: TrendingUp
    }
  ];

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDateRangeChange = (value: string) => {
    // setDateRange(value);
    // fetchData();
  };

  const fetchData = () => {
    setIsLoading(true);
    setError(null);
    // Simulating API call
    setTimeout(() => {
      if (Math.random() > 0.8) {
        setError('Failed to fetch data. Please try again.');
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto space-y-6 p-4">
      <header className="mb-6 flex flex-col items-start justify-between sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">Workout Analytics</h1>
          <p className="mt-1 text-muted-foreground">{dateRanges.find((range) => range.value === dateRange)?.label}</p>
        </div>
        <Select value={dateRange} onValueChange={handleDateRangeChange}>
          <SelectTrigger className="mt-2 w-[180px] sm:mt-0">
            <SelectValue placeholder="Select date range" />
          </SelectTrigger>
          <SelectContent>
            {dateRanges.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metricsConfig.map((metric) => (
          <Card key={metric.title} className="transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex h-[52px] items-center">
                  <div className="h-2 w-full rounded bg-muted">
                    <div className="h-2 animate-pulse rounded bg-primary" style={{ width: '60%' }}></div>
                  </div>
                </div>
              ) : error ? (
                <div className="text-sm text-red-500">Error loading data</div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  {metric.change !== undefined && (
                    <p className={`text-xs ${metric.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      <span className="inline-flex items-center">
                        {metric.change >= 0 ? (
                          <TrendingUp className="mr-1 h-3 w-3" />
                        ) : (
                          <TrendingDown className="mr-1 h-3 w-3" />
                        )}
                        {Math.abs(metric.change)}%
                      </span>
                      {' vs previous period'}
                    </p>
                  )}
                  {metric.subtitle && <p className="mt-1 text-xs text-muted-foreground">{metric.subtitle}</p>}
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {error && (
        <div className="mt-4 rounded border border-red-400 bg-red-100 p-4 text-red-700" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
    </div>
  );
}
