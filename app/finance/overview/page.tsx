'use client';

import { useState } from 'react';
import { Bell, Calendar, Download, Share2, TrendingDown, TrendingUp } from 'lucide-react';
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data
const budgetData = [
  { category: 'Housing', budget: 1500, spent: 1450, icon: '🏠' },
  { category: 'Food', budget: 500, spent: 480, icon: '🍔' },
  { category: 'Transportation', budget: 300, spent: 250, icon: '🚗' },
  { category: 'Utilities', budget: 200, spent: 180, icon: '💡' },
  { category: 'Entertainment', budget: 200, spent: 220, icon: '🎬' }
];

const spendingData = [
  { name: 'Mon', amount: 120 },
  { name: 'Tue', amount: 80 },
  { name: 'Wed', amount: 100 },
  { name: 'Thu', amount: 150 },
  { name: 'Fri', amount: 200 },
  { name: 'Sat', amount: 180 },
  { name: 'Sun', amount: 100 }
];

const categoryData = budgetData.map((item) => ({
  name: item.category,
  value: item.spent
}));

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function BudgetDashboard() {
  const [dateRange, setDateRange] = useState('This Month');

  const totalBudget = budgetData.reduce((sum, item) => sum + item.budget, 0);
  const totalSpent = budgetData.reduce((sum, item) => sum + item.spent, 0);
  const remainingBudget = totalBudget - totalSpent;
  const dailyAverage = totalSpent / 30; // Assuming 30 days in a month

  return (
    <div className="container mx-auto space-y-6 p-4">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Budget Analysis</h1>
        <div className="flex items-center space-x-4">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="This Week">This Week</SelectItem>
              <SelectItem value="This Month">This Month</SelectItem>
              <SelectItem value="Last 3 Months">Last 3 Months</SelectItem>
              <SelectItem value="This Year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget vs Actual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalSpent.toFixed(2)} / ${totalBudget.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalSpent > totalBudget ? (
                <span className="flex items-center text-red-500">
                  <TrendingUp className="mr-1 h-4 w-4" /> Over budget
                </span>
              ) : (
                <span className="flex items-center text-green-500">
                  <TrendingDown className="mr-1 h-4 w-4" /> Under budget
                </span>
              )}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${remainingBudget.toFixed(2)}</div>
            <Progress value={(remainingBudget / totalBudget) * 100} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Spending Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${dailyAverage.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Per day this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Spending Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{budgetData[0].category}</div>
            <p className="text-xs text-muted-foreground">${budgetData[0].spent.toFixed(2)} spent</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Budget Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {budgetData.map((category, index) => (
              <div key={category.category} className="flex items-center">
                <div className="mr-3 flex h-9 w-9 items-center justify-center rounded-full bg-muted text-2xl">
                  {category.icon}
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex justify-between">
                    <span className="text-sm font-medium">{category.category}</span>
                    <span className="text-sm font-medium">
                      ${category.spent.toFixed(2)} / ${category.budget.toFixed(2)}
                    </span>
                  </div>
                  <Progress value={(category.spent / category.budget) * 100} className="h-2" />
                </div>
                <div className="ml-3 text-sm font-medium">{((category.spent / category.budget) * 100).toFixed(0)}%</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Spending Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="daily">
              <TabsList>
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
              </TabsList>
              <TabsContent value="daily" className="space-y-4">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={spendingData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Bar dataKey="amount" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="weekly">
                {/* Weekly chart would go here */}
                <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                  Weekly data visualization
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {categoryData.map((entry, index) => (
                <div key={entry.name} className="flex items-center">
                  <div
                    className="mr-2 h-3 w-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Spending Patterns</h3>
              <p className="text-sm text-muted-foreground">Your highest spending day is typically Friday.</p>
            </div>
            <div>
              <h3 className="font-semibold">Budget Recommendations</h3>
              <p className="text-sm text-muted-foreground">Consider reducing your entertainment budget by 10%.</p>
            </div>
            <div>
              <h3 className="font-semibold">Savings Opportunities</h3>
              <p className="text-sm text-muted-foreground">
                You could save $50 by reducing your daily coffee purchases.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Category Comparisons</h3>
              <p className="text-sm text-muted-foreground">Your food spending is 20% higher than last month.</p>
            </div>
            <div>
              <h3 className="font-semibold">Projected Overages</h3>
              <p className="text-sm text-muted-foreground">
                You&apos;re on track to exceed your entertainment budget by $30 this month.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
