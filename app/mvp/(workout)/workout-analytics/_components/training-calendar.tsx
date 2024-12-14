'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
  getDay
} from 'date-fns';
import { mapWorkoutsToHeatmapData } from '@/app/mvp/(workout)/_utils/mapWorkoutsToHeatmapData';

type WorkoutData = {
  exercises: number;
  volume: number;
  type: string;
  intensity: number;
};

type HeatmapData = Record<string, WorkoutData[]>;

// Mock data generator (unchanged)
const generateMockData = (startDate: Date, endDate: Date): HeatmapData => {
  const data: HeatmapData = {};
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  days.forEach((day) => {
    if (Math.random() > 0.3) {
      const workouts = Math.floor(Math.random() * 3) + 1;
      data[format(day, 'yyyy-MM-dd')] = Array(workouts)
        .fill(null)
        .map(() => ({
          exercises: Math.floor(Math.random() * 5) + 1,
          volume: Math.floor(Math.random() * 10000) + 1000,
          type: ['Strength', 'Cardio', 'Flexibility'][Math.floor(Math.random() * 3)],
          intensity: Math.random()
        }));
    }
  });

  return data;
};

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const getIntensityColor = (intensity: number) => {
  const baseColor = [229, 186, 115]; // #E5BA73
  const maxColor = [164, 126, 59]; // #A47E3B
  const color = baseColor.map((channel, index) => Math.round(channel + (maxColor[index] - channel) * intensity));
  return `rgb(${color.join(',')})`;
};

const DayCell = React.memo(
  ({ day, monthStart, dayStr, dayData }: { day: Date; monthStart: Date; dayStr: string; dayData: WorkoutData[] }) => {
    return (
      <div
        className={`relative border border-border p-2 ${
          !isSameMonth(day, monthStart) ? 'bg-muted text-muted-foreground' : isToday(day) ? 'bg-primary/20' : ''
        }`}
      >
        <span className="absolute left-1 top-1 text-xs">{format(day, 'd')}</span>
        {dayData.length > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="mt-4 flex flex-wrap justify-end gap-1">
                {dayData.map((workout, index) => (
                  <div
                    key={index}
                    className="h-3 w-3 cursor-pointer rounded-sm transition-transform hover:scale-110"
                    style={{ backgroundColor: getIntensityColor(workout.intensity) }}
                  />
                ))}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-sm">
                <p className="font-bold">{format(day, 'MMMM d, yyyy')}</p>
                {dayData.map((workout, index) => (
                  <div key={index} className="mt-1">
                    <p>Workout {index + 1}:</p>
                    <p>Exercises: {workout.exercises}</p>
                    <p>Volume: {workout.volume.toLocaleString()} kg</p>
                    <p>Type: {workout.type}</p>
                  </div>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    );
  }
);

DayCell.displayName = 'DayCell';

export default function TrainingCalendar({ workouts }: { workouts: any[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [heatmapData, setHeatmapData] = useState<HeatmapData>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      // TODO: Replace mock data with actual data and remove the mock data generator
      // const data = generateMockData(monthStart, monthEnd);
      const data2 = mapWorkoutsToHeatmapData(workouts);
      setHeatmapData(data2);
      setIsLoading(false);
    };
    fetchData();
  }, [currentDate]);

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = monthStart;
    const endDate = monthEnd;

    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const startDay = getDay(startDate);

    // Prepend empty days to align with the correct day of the week
    const emptyDays = Array(startDay === 0 ? 6 : startDay - 1).fill(null);

    return [...emptyDays, ...days];
  }, [currentDate]);

  return (
    <TooltipProvider>
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center text-xl font-semibold">
            <Calendar className="mr-2 h-6 w-6" />
            Training Calendar
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={handlePrevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium">{format(currentDate, 'MMMM yyyy')}</span>
            <Button variant="outline" size="icon" onClick={handleNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-2 grid grid-cols-7 gap-px">
            {weekDays.map((day) => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>
          {isLoading ? (
            <div className="flex h-[400px] items-center justify-center">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : Object.keys(heatmapData).length === 0 ? (
            <div className="flex h-[400px] items-center justify-center text-muted-foreground">
              No training data available for this period
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-px">
              {calendarDays.map((day, index) =>
                day ? (
                  <DayCell
                    key={day.toString()}
                    day={day}
                    monthStart={startOfMonth(currentDate)}
                    dayStr={format(day, 'yyyy-MM-dd')}
                    dayData={heatmapData[format(day, 'yyyy-MM-dd')] || []}
                  />
                ) : (
                  <div key={`empty-${index}`} className="bg-muted" />
                )
              )}
            </div>
          )}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Intensity:</span>
              <div className="flex items-center space-x-1">
                <div className="h-4 w-4 bg-[#E5BA73]" />
                <span className="text-xs">Low</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="h-4 w-4 bg-[#A47E3B]" />
                <span className="text-xs">High</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
