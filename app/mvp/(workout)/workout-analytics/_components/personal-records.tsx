'use client';

import { useState, useEffect, Fragment } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trophy, ChevronDown, ChevronUp, Dumbbell, ArrowUp } from 'lucide-react';

// Mock data for personal records
const personalRecordsData = [
  {
    id: 1,
    exercise: 'Bench Press',
    weight: 100,
    previousRecord: 95,
    date: '2023-06-15',
    history: [
      { weight: 95, date: '2023-05-20' },
      { weight: 90, date: '2023-04-10' }
    ]
  },
  {
    id: 2,
    exercise: 'Squat',
    weight: 150,
    previousRecord: 140,
    date: '2023-06-10',
    history: [
      { weight: 140, date: '2023-05-15' },
      { weight: 135, date: '2023-04-05' }
    ]
  },
  {
    id: 3,
    exercise: 'Deadlift',
    weight: 180,
    previousRecord: 175,
    date: '2023-06-05',
    history: [
      { weight: 175, date: '2023-05-10' },
      { weight: 170, date: '2023-04-01' }
    ]
  },
  {
    id: 4,
    exercise: 'Overhead Press',
    weight: 70,
    previousRecord: 65,
    date: '2023-06-01',
    history: [
      { weight: 65, date: '2023-05-05' },
      { weight: 60, date: '2023-04-15' }
    ]
  },
  {
    id: 5,
    exercise: 'Pull-up',
    weight: 30,
    previousRecord: 25,
    date: '2023-05-28',
    history: [
      { weight: 25, date: '2023-05-01' },
      { weight: 20, date: '2023-04-20' }
    ]
  }
];

type Props = {
  personalRecords: PersonalRecord[];
};

export default function PersonalRecords({ personalRecords }: Props) {
  const [records, setRecords] = useState(personalRecords);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  useEffect(() => {
    setRecords(personalRecords);
    setIsLoading(false);
    // Simulate API call
    // const fetchData = async () => {
    //   setIsLoading(true);
    //   await new Promise((resolve) => setTimeout(resolve, 1000));
    //   setRecords(personalRecordsData);
    //   setIsLoading(false);
    // };
    // fetchData();
  }, [personalRecords]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatWeight = (weight: number) => {
    return `${weight} kg`;
  };

  const calculateImprovement = (current: number, previous: number) => {
    const improvement = ((current - previous) / previous) * 100;
    return improvement.toFixed(1);
  };

  const toggleRowExpansion = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center text-xl font-semibold">
          <Trophy className="mr-2 h-6 w-6 text-yellow-500" />
          Personal Records
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-4">
            <div className="mb-4 h-8 w-full animate-pulse rounded bg-muted"></div>
            <div className="mb-4 h-8 w-full animate-pulse rounded bg-muted"></div>
            <div className="mb-4 h-8 w-full animate-pulse rounded bg-muted"></div>
          </div>
        ) : records.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">No personal records yet. Keep pushing yourself!</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Exercise</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead>Previous</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Improvement</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <Fragment key={record.id}>
                    <TableRow
                      className="cursor-pointer transition-colors hover:bg-muted/50"
                      onClick={() => toggleRowExpansion(record.id)}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Dumbbell className="mr-2 h-4 w-4 text-muted-foreground" />
                          {record.exercise}
                        </div>
                      </TableCell>
                      <TableCell>{formatWeight(record.weight)}</TableCell>
                      <TableCell>{formatWeight(record.previousRecord)}</TableCell>
                      <TableCell>{formatDate(record.date)}</TableCell>
                      <TableCell>
                        <span className="flex items-center text-green-500">
                          <ArrowUp className="mr-1 h-4 w-4" />
                          {calculateImprovement(record.weight, record.previousRecord)}%
                        </span>
                      </TableCell>
                      <TableCell>
                        {expandedRow === record.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </TableCell>
                    </TableRow>
                    {expandedRow === record.id && (
                      <TableRow className="bg-muted/30">
                        <TableCell colSpan={6}>
                          <div className="p-2">
                            <h4 className="mb-2 font-semibold">History</h4>
                            <h4 className="mb-2 font-semibold">{record.history.length}</h4>
                            {record.history.map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span>{formatWeight(item.weight)}</span>
                                <span>{formatDate(item.date)}</span>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        <div className="flex justify-center p-4">
          <Button variant="outline">View all records</Button>
        </div>
      </CardContent>
    </Card>
  );
}
