'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  MoreVertical,
  LogOut,
} from 'lucide-react';
import PageContainer from '@/components/layout/page-container';
import TrainingPlans from './_components/training-plans';
import CreateTrainingPlan from './_components/create-training-plan';
import TrainingDayConfig from './_components/training-day-config';
import SupersetConfigModal from './_components/superset-config-modal';

const WorkoutPlansDashboard = () => {
  return (
    <PageContainer scrollable>
      <div className="container mx-auto p-4">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src="/placeholder-avatar.jpg" alt="Admin User" />
                <AvatarFallback>AU</AvatarFallback>
              </Avatar>
              <span>Admin User</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <Tabs defaultValue="training-plans">
          <TabsList>
            <TabsTrigger value="training-plans">Training Plans</TabsTrigger>
            <TabsTrigger value="create-training-plan">Create Training Plan</TabsTrigger>
            <TabsTrigger value="training-day-config">Training Day Config</TabsTrigger>
            <TabsTrigger value="superset-config-modal">Superset Config Modal</TabsTrigger>
          </TabsList>
          <TabsContent value="training-plans">
            <Card>
              <TrainingPlans />
            </Card>
          </TabsContent>
          <TabsContent value="create-training-plan">
            <Card>
              <CreateTrainingPlan />
            </Card>
          </TabsContent>
          <TabsContent value="training-day-config">
            <Card>
              <TrainingDayConfig />
            </Card>
          </TabsContent>
          <TabsContent value="superset-config-modal">
            <Card>
              <SupersetConfigModal />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default WorkoutPlansDashboard;
