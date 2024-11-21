'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';

export default function Component() {
  const [activeTab, setActiveTab] = useState('exercise-list');

  const exercises = [
    { name: 'Chest', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80' },
    { name: 'Biceps', image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80' },
    { name: 'Triceps', image: 'https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?w=800&q=80' },
    { name: 'Back', image: 'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?w=800&q=80' },
    { name: 'Shoulder', image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&q=80' },
    { name: 'Legs', image: 'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=800&q=80' }
  ];

  const workoutPlans = [
    {
      title: 'Upper Body',
      author: 'renan',
      date: 'February 7, 12:52',
      muscles: ['Back', 'Chest', 'Shoulder'],
      description: 'Treino Upper - Segunda e Quinta',
      isPro: false,
      avatar:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=faces&auto=format&q=80'
    },
    {
      title: 'Chest and triceps',
      author: 'TheBrain',
      date: 'April 8, 15:02',
      muscles: ['Chest', 'Triceps'],
      isPro: false,
      avatar:
        'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=80&h=80&fit=crop&crop=faces&auto=format&q=80'
    },
    {
      title: 'Regular Startup Plan',
      author: 'Scott Sigerfoos',
      date: 'January 16, 03:50',
      muscles: ['Abdominal', 'Biceps', 'Chest', 'Legs', 'Shoulder'],
      isPro: false,
      avatar: 'https://randomuser.me/api/portraits/men/75.jpg'
    },
    {
      title: 'AWB first months',
      author: 'Andres W',
      date: 'January 6, 12:13',
      muscles: ['Back', 'Chest', 'Legs'],
      description:
        'This is a complete body workout for people that want to go 3 times a week to the gym and targets a general but complete workout of the body to improve in short time the performance.',
      isPro: false,
      avatar: 'https://randomuser.me/api/portraits/men/23.jpg'
    },
    {
      title: 'Split A',
      author: 'Ryan Geraghty',
      date: 'January 12, 22:12',
      muscles: ['Back', 'Biceps', 'Chest', 'Triceps'],
      description: 'This workout is done on Monday and Thursday of weeks 1 - 3.',
      isPro: false,
      avatar: 'https://randomuser.me/api/portraits/men/35.jpg'
    },
    {
      title: 'Kava edasijõudnutele, päev 1/4: Rind ja Biitseps',
      author: 'Indrek Ulst',
      date: 'January 19, 10:01',
      muscles: ['Abdominal', 'Biceps', 'Chest'],
      description:
        'Nädala esimene trenn, teeme rinda ja biitsepsit. Rinna teist ja kolmandat harjutust ning biitsepsi harjutusi võib aeg-ajalt vahetada, et asi liiga üksluiseks ei läheks.',
      isPro: true,
      avatar: 'https://randomuser.me/api/portraits/men/42.jpg'
    }
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="relative h-[300px] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80"
          alt="Gym equipment background"
          className="object-cover brightness-50"
          fill
          priority
        />
        <div className="absolute inset-0 bg-blue-600/50" />
        <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-white md:text-6xl">
          Exercises
        </h1>
      </header>

      <nav className="border-b">
        <div className="container mx-auto flex gap-4 px-4">
          <button
            onClick={() => setActiveTab('exercise-list')}
            className={`px-4 py-4 text-sm font-medium transition-colors ${
              activeTab === 'exercise-list'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-primary'
            }`}
          >
            Exercise List
          </button>
          <button
            onClick={() => setActiveTab('workout-plans')}
            className={`px-4 py-4 text-sm font-medium transition-colors ${
              activeTab === 'workout-plans'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-primary'
            }`}
          >
            Workout plans
          </button>
        </div>
      </nav>

      <main className="container mx-auto flex-1 px-4 py-8">
        <div className="border-b">
          <div className="container mx-auto px-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList>
                <TabsTrigger value="exercise-list">Exercise List</TabsTrigger>
                <TabsTrigger value="workout-plans">Workout Plans</TabsTrigger>
              </TabsList>
              <TabsContent value="exercise-list" className="space-y-4">
                <h2 className="mb-6 mt-6 text-3xl font-bold">Exercise List</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {exercises.map((exercise) => (
                    <Link
                      key={exercise.name}
                      href="#"
                      className="group relative aspect-[4/3] overflow-hidden rounded-lg"
                    >
                      <Image
                        src={exercise.image}
                        alt={`${exercise.name} exercises`}
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        fill
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <span className="absolute bottom-4 left-4 text-2xl font-semibold text-white">
                        {exercise.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="workout-plans" className="pt-6">
                <h2 className="mb-6 mt-6 text-3xl font-bold">Popular workout plans</h2>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search..." className="pl-8" />
                  </div>
                  <div className="flex gap-2">
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="- Muscle group -" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="chest">Chest</SelectItem>
                        <SelectItem value="back">Back</SelectItem>
                        <SelectItem value="legs">Legs</SelectItem>
                        <SelectItem value="shoulders">Shoulders</SelectItem>
                        <SelectItem value="biceps">Biceps</SelectItem>
                        <SelectItem value="triceps">Triceps</SelectItem>
                        <SelectItem value="abdominal">Abdominal</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Search</Button>
                  </div>
                </div>
                <div className="mt-4 space-y-4">
                  {workoutPlans.map((plan) => (
                    <div
                      key={plan.title}
                      className="flex gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                    >
                      <Image
                        src={plan.avatar}
                        alt={`${plan.author}'s avatar`}
                        className="h-10 w-10 rounded-full"
                        width={40}
                        height={40}
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <Link href="#" className="text-lg font-semibold hover:underline">
                            {plan.title}
                          </Link>
                          {plan.isPro && (
                            <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                              PRO
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
                          <span>{plan.author}</span>
                          <span>•</span>
                          <span>{plan.date}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {plan.muscles.map((muscle) => (
                            <Badge key={muscle} variant="secondary">
                              {muscle}
                            </Badge>
                          ))}
                        </div>
                        {plan.description && <p className="text-sm text-muted-foreground">{plan.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
