'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Lightbulb, Calendar, TrendingUp, Battery, Target, Info } from 'lucide-react';

type InsightCardProps = {
  title: string;
  icon: React.ReactNode;
  primaryStat: string;
  supportingText: string;
  detailedInfo: string;
};

const InsightCard = ({ title, icon, primaryStat, supportingText, detailedInfo }: InsightCardProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Dialog>
            <DialogTrigger asChild>
              <Card className="cursor-pointer transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{title}</CardTitle>
                  {icon}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{primaryStat}</div>
                  <p className="mt-1 text-xs text-muted-foreground">{supportingText}</p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <p>{detailedInfo}</p>
              </div>
            </DialogContent>
          </Dialog>
        </TooltipTrigger>
        <TooltipContent>
          <p>Click for more details</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Mock data for insights
const mockInsights = {
  mostConsistentDay: { day: 'Monday', sessionsCount: 12 },
  volumeTrend: { percentage: 15, direction: 'up' },
  restPattern: { averageDays: 2.5 },
  focusAreas: { muscleGroup: 'Legs', sessions: 8 }
};

type Props = {
  insights: {
    mostConsistentDay: { day: string; sessionsCount: number };
    volumeTrend: { percentage: number; direction: string };
    restPattern: { averageDays: number };
    focusAreas: { muscleGroup: string; sessions: number };
  };
};

export default function TrainingInsights({insights: i}: Props) {
  const [insights, setInsights] = useState(i);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // setInsights(mockInsights);
      setIsLoading(false);
    };

    fetchInsights();
  }, []);

  if (isLoading) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center text-xl font-semibold">
            <Lightbulb className="mr-2 h-6 w-6" />
            Training Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[...Array(4)].map((_, index) => (
              <Card key={index} className="h-[100px] animate-pulse bg-muted"></Card>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!insights) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center text-xl font-semibold">
            <Lightbulb className="mr-2 h-6 w-6" />
            Training Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Not enough data to generate insights. Keep training and check back soon!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-semibold">
          <Lightbulb className="mr-2 h-6 w-6" />
          Training Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InsightCard
            title="Most Consistent Day"
            icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
            primaryStat={insights.mostConsistentDay.day}
            supportingText={`${insights.mostConsistentDay.sessionsCount} sessions this month`}
            detailedInfo={`You've been most consistent with your workouts on ${insights.mostConsistentDay.day}s, with ${insights.mostConsistentDay.sessionsCount} sessions this month. Keep up the great work and consider scheduling important workouts on this day to maximize your consistency.`}
          />
          <InsightCard
            title="Volume Trend"
            icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
            primaryStat={`${insights.volumeTrend.percentage}% ${insights.volumeTrend.direction}`}
            supportingText="Compared to last month"
            detailedInfo={`Your training volume is ${insights.volumeTrend.percentage}% ${
              insights.volumeTrend.direction
            } compared to last month. This indicates ${
              insights.volumeTrend.direction === 'up'
                ? 'progress in your training intensity'
                : 'a slight decrease in your training load'
            }. Consider ${
              insights.volumeTrend.direction === 'up' ? 'maintaining this momentum' : 'gradually increasing your volume'
            } to optimize your gains.`}
          />
          <InsightCard
            title="Rest Pattern"
            icon={<Battery className="h-4 w-4 text-muted-foreground" />}
            primaryStat={`${insights.restPattern.averageDays} days`}
            supportingText="Average rest between workouts"
            detailedInfo={`You're taking an average of ${
              insights.restPattern.averageDays
            } days of rest between workouts. This rest pattern ${
              insights.restPattern.averageDays < 2
                ? 'might not provide enough recovery time'
                : insights.restPattern.averageDays > 3
                ? 'might be more than optimal for muscle growth'
                : 'seems to be in a good range for recovery and growth'
            }. Remember, adequate rest is crucial for muscle recovery and overall progress.`}
          />
          <InsightCard
            title="Focus Areas"
            icon={<Target className="h-4 w-4 text-muted-foreground" />}
            primaryStat={insights.focusAreas.muscleGroup}
            supportingText={`${insights.focusAreas.sessions} sessions this month`}
            detailedInfo={`You've focused most on training your ${insights.focusAreas.muscleGroup} this month, with ${insights.focusAreas.sessions} dedicated sessions. This focus can lead to significant improvements in this area. Consider balancing your routine by giving equal attention to other muscle groups to ensure overall body development and prevent imbalances.`}
          />
        </div>
      </CardContent>
    </Card>
  );
}
