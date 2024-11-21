import Image from "next/image"
import Link from "next/link"
import { Search, Plus, Trash2 } from 'lucide-react'

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

export default function Component() {
  const exercises = [
    { id: 1, name: "Bench Press", muscle: "Chest", image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80" },
    { id: 2, name: "Bicep Curls", muscle: "Biceps", image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80" },
    { id: 3, name: "Tricep Pushdowns", muscle: "Triceps", image: "https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?w=800&q=80" },
    { id: 4, name: "Lat Pulldowns", muscle: "Back", image: "https://images.unsplash.com/photo-1603287681836-b174ce5074c2?w=800&q=80" },
    { id: 5, name: "Shoulder Press", muscle: "Shoulder", image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&q=80" },
    { id: 6, name: "Squats", muscle: "Legs", image: "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=800&q=80" },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="relative h-[200px] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80"
          alt="Gym equipment background"
          className="object-cover brightness-50"
          fill
          priority
        />
        <div className="absolute inset-0 bg-blue-600/50" />
        <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-white md:text-6xl">
          Create Exercise List
        </h1>
      </header>

      <main className="container mx-auto flex-1 px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Available Exercises</h2>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search exercises..."
                  className="pl-8"
                />
              </div>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by muscle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All muscles</SelectItem>
                  <SelectItem value="chest">Chest</SelectItem>
                  <SelectItem value="back">Back</SelectItem>
                  <SelectItem value="legs">Legs</SelectItem>
                  <SelectItem value="shoulders">Shoulders</SelectItem>
                  <SelectItem value="biceps">Biceps</SelectItem>
                  <SelectItem value="triceps">Triceps</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ScrollArea className="h-[calc(100vh-400px)]">
              <div className="grid gap-4">
                {exercises.map((exercise) => (
                  <div key={exercise.id} className="flex items-center gap-4 rounded-lg border p-4">
                    <Image
                      src={exercise.image}
                      alt={exercise.name}
                      width={80}
                      height={80}
                      className="rounded-md object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{exercise.name}</h3>
                      <p className="text-sm text-muted-foreground">{exercise.muscle}</p>
                    </div>
                    <Button size="icon" variant="ghost">
                      <Plus className="h-4 w-4" />
                      <span className="sr-only">Add {exercise.name} to list</span>
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Your Exercise List</h2>
            <div className="rounded-lg border p-4">
              <ScrollArea className="h-[calc(100vh-400px)]">
                <div className="space-y-4">
                  {exercises.slice(0, 3).map((exercise) => (
                    <div key={exercise.id} className="flex items-center gap-4">
                      <Image
                        src={exercise.image}
                        alt={exercise.name}
                        width={60}
                        height={60}
                        className="rounded-md object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{exercise.name}</h3>
                        <p className="text-sm text-muted-foreground">{exercise.muscle}</p>
                      </div>
                      <Button size="icon" variant="ghost">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove {exercise.name} from list</span>
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
            <Separator />
            <div className="flex justify-between">
              <p className="text-lg font-semibold">Total Exercises: 3</p>
              <Button>Save Exercise List</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}