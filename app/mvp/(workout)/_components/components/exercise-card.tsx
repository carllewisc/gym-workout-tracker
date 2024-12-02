'use client';

import * as React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus, X } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface Set {
  weight: string;
  reps: string;
}

interface ExerciseCardProps {
  name: string;
  muscle: string;
  sets: Set[];
  onUpdateSet: (index: number, field: 'weight' | 'reps', value: string) => void;
  onAddSet: () => void;
  onRemoveSet: (index: number) => void;
  onRemoveExercise: () => void;
}

export function ExerciseCard({
  name,
  muscle,
  sets,
  onUpdateSet,
  onAddSet,
  onRemoveSet,
  onRemoveExercise
}: ExerciseCardProps) {
  return (
    <Card className="relative mb-4 overflow-hidden">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="exercise" className="border-none">
          <div className="flex items-center justify-between border-b">
            <AccordionTrigger className="flex-1 px-4 py-3 hover:no-underline [&[data-state=open]>div]:bg-accent">
              <div className="flex w-full items-center justify-between rounded-md px-2 py-1 transition-colors">
                <div className="flex flex-col items-start">
                  <div className="font-semibold">{name}</div>
                  <div className="text-sm text-muted-foreground">{muscle}</div>
                </div>
              </div>
            </AccordionTrigger>
            <Button
              variant="ghost"
              size="sm"
              className="mr-2 h-8 w-8 rounded-full p-0 text-muted-foreground hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveExercise();
              }}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove exercise</span>
            </Button>
          </div>
          <AccordionContent>
            <div className="space-y-3 p-4">
              {sets.map((set, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex h-10 w-8 items-center justify-center rounded-md bg-muted text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="flex flex-1 items-center gap-2">
                    <Input
                      type="number"
                      value={set.weight}
                      onChange={(e) => onUpdateSet(index, 'weight', e.target.value)}
                      className="h-10"
                      placeholder="0"
                    />
                    <span className="whitespace-nowrap text-muted-foreground">kg ×</span>
                    <Input
                      type="number"
                      value={set.reps}
                      onChange={(e) => onUpdateSet(index, 'reps', e.target.value)}
                      className="h-10"
                      placeholder="0"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 rounded-full p-0 text-muted-foreground hover:text-destructive"
                    onClick={() => onRemoveSet(index)}
                  >
                    <Minus className="h-4 w-4" />
                    <span className="sr-only">Remove set</span>
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" className="mt-2 w-full" onClick={onAddSet}>
                <Plus className="mr-2 h-4 w-4" />
                Add Set
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
