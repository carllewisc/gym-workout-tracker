import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WorkoutStatsProps {
  stats: {
    startingWeight: number;
    currentWeight: number;
    improvement: number;
    bestSession: number;
  };
}

const WorkoutStats = ({ stats }: WorkoutStatsProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Starting Weight</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.startingWeight}kg</div>
        </CardContent>
      </Card>
      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Current Weight</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.currentWeight}kg</div>
        </CardContent>
      </Card>
      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Improvement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[#E5BA73]">+{stats.improvement}kg</div>
        </CardContent>
      </Card>
      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Best Session</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.bestSession}kg</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkoutStats;