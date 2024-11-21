'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { Loader2, RotateCcw, Download, Upload, Clock } from 'lucide-react';

export default function AdminSettings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = (section: string) => {
    setIsLoading(true);
    // Simulating an API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: 'Settings Saved',
        description: `${section} settings have been updated successfully.`
      });
    }, 1000);
  };

  const handleReset = (section: string) => {
    // Reset logic would go here
    toast({
      title: 'Settings Reset',
      description: `${section} settings have been reset to default values.`
    });
  };

  return (
    <div className="container mx-auto space-y-4 p-4">
      <h1 className="text-3xl font-bold">Admin Settings</h1>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="exercise">Exercise</TabsTrigger>
          <TabsTrigger value="user">User</TabsTrigger>
          <TabsTrigger value="notification">Notification</TabsTrigger>
          <TabsTrigger value="backup">Backup & Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage your application's general settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="appName">Application Name</Label>
                  <Input id="appName" placeholder="My Workout App" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="utc">
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="est">Eastern Time</SelectItem>
                      <SelectItem value="pst">Pacific Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select defaultValue="yyyy-mm-dd">
                    <SelectTrigger id="dateFormat">
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                      <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="units">Units</Label>
                  <Select defaultValue="metric">
                    <SelectTrigger id="units">
                      <SelectValue placeholder="Select units" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="metric">Metric</SelectItem>
                      <SelectItem value="imperial">Imperial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Default Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input id="supportEmail" type="email" placeholder="support@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="termsUrl">Terms of Service URL</Label>
                  <Input id="termsUrl" type="url" placeholder="https://example.com/terms" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="privacyUrl">Privacy Policy URL</Label>
                  <Input id="privacyUrl" type="url" placeholder="https://example.com/privacy" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => handleReset('General')}>
                Reset to Defaults
              </Button>
              <Button onClick={() => handleSave('General')} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="exercise">
          <Card>
            <CardHeader>
              <CardTitle>Exercise Settings</CardTitle>
              <CardDescription>Configure exercise-related settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="restTimer">Default Rest Timer (seconds)</Label>
                  <Input id="restTimer" type="number" placeholder="60" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exerciseView">Default Exercise View</Label>
                  <Select defaultValue="grid">
                    <SelectTrigger id="exerciseView">
                      <SelectValue placeholder="Select view" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid">Grid</SelectItem>
                      <SelectItem value="list">List</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Muscle Groups Management</Label>
                <Textarea placeholder="Enter muscle groups, one per line" />
              </div>
              <div className="space-y-2">
                <Label>Equipment Categories</Label>
                <Textarea placeholder="Enter equipment categories, one per line" />
              </div>
              <div className="space-y-2">
                <Label>Difficulty Levels</Label>
                <Textarea placeholder="Enter difficulty levels, one per line" />
              </div>
              <div className="space-y-2">
                <Label>Exercise Validation Rules</Label>
                <Textarea placeholder="Enter validation rules" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => handleReset('Exercise')}>
                Reset to Defaults
              </Button>
              <Button onClick={() => handleSave('Exercise')} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="user">
          <Card>
            <CardHeader>
              <CardTitle>User Settings</CardTitle>
              <CardDescription>Manage user-related settings and policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="registration">
                  <AccordionTrigger>Registration Settings</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch id="emailVerification" />
                        <Label htmlFor="emailVerification">Email verification required</Label>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="defaultRole">Default User Role</Label>
                        <Select defaultValue="user">
                          <SelectTrigger id="defaultRole">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="premium">Premium User</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="welcomeEmail">Welcome Email Template</Label>
                        <Textarea id="welcomeEmail" placeholder="Enter welcome email template" />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="password">
                  <AccordionTrigger>Password Policies</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="minLength">Minimum Password Length</Label>
                        <Input id="minLength" type="number" placeholder="8" />
                      </div>
                      <div className="space-y-2">
                        <Label>Complexity Requirements</Label>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Switch id="requireUppercase" />
                            <Label htmlFor="requireUppercase">Require uppercase letter</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="requireLowercase" />
                            <Label htmlFor="requireLowercase">Require lowercase letter</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="requireNumber" />
                            <Label htmlFor="requireNumber">Require number</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="requireSpecial" />
                            <Label htmlFor="requireSpecial">Require special character</Label>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="resetPasswordExpiry">Reset Password Link Expiry (hours)</Label>
                        <Input id="resetPasswordExpiry" type="number" placeholder="24" />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="restrictions">
                  <AccordionTrigger>Account Restrictions</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="maxLoginAttempts">Max Failed Login Attempts</Label>
                        <Input id="maxLoginAttempts" type="number" placeholder="5" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                        <Input id="sessionTimeout" type="number" placeholder="30" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="accountLockout">Account Lockout Duration (minutes)</Label>
                        <Input id="accountLockout" type="number" placeholder="30" />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => handleReset('User')}>
                Reset to Defaults
              </Button>
              <Button onClick={() => handleSave('User')} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notification">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure email and push notification settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="email">
                  <AccordionTrigger>Email Notifications</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch id="systemAlerts" />
                        <Label htmlFor="systemAlerts">System Alerts</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="userReports" />
                        <Label htmlFor="userReports">User Reports</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="newRegistrations" />
                        <Label htmlFor="newRegistrations">New Registrations</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="supportTickets" />
                        <Label htmlFor="supportTickets">Support Tickets</Label>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="push">
                  <AccordionTrigger>Push Notifications</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch id="workoutReminders" />
                        <Label htmlFor="workoutReminders">Workout Reminders</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="achievementAlerts" />
                        <Label htmlFor="achievementAlerts">Achievement Alerts</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="systemUpdates" />
                        <Label htmlFor="systemUpdates">System Updates</Label>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => handleReset('Notification')}>
                Reset to Defaults
              </Button>
              <Button onClick={() => handleSave('Notification')} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle>Backup & Maintenance</CardTitle>
              <CardDescription>Manage system backups and maintenance tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="backup">
                  <AccordionTrigger>Database Backup Settings</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="backupFrequency">Backup Frequency</Label>
                        <Select defaultValue="daily">
                          <SelectTrigger id="backupFrequency">
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hourly">Hourly</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="backupRetention">Backup Retention (days)</Label>
                        <Input id="backupRetention" type="number" placeholder="30" />
                      </div>
                      <Button className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        Backup Now
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="retention">
                  <AccordionTrigger>Data Retention Policies</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="userDataRetention">User Data Retention (months)</Label>
                        <Input id="userDataRetention" type="number" placeholder="24" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="activityLogRetention">Activity Log Retention (months)</Label>
                        <Input id="activityLogRetention" type="number" placeholder="12" />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="cache">
                  <AccordionTrigger>Cache Management</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cacheLifetime">Cache Lifetime (minutes)</Label>
                        <Input id="cacheLifetime" type="number" placeholder="60" />
                      </div>
                      <Button className="w-full">
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Clear Cache
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="logs">
                  <AccordionTrigger>System Logs</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="logLevel">Log Level</Label>
                        <Select defaultValue="error">
                          <SelectTrigger id="logLevel">
                            <SelectValue placeholder="Select log level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="debug">Debug</SelectItem>
                            <SelectItem value="info">Info</SelectItem>
                            <SelectItem value="warn">Warn</SelectItem>
                            <SelectItem value="error">Error</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        Download Logs
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => handleReset('Backup & Maintenance')}>
                Reset to Defaults
              </Button>
              <Button onClick={() => handleSave('Backup & Maintenance')} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Advanced Options</CardTitle>
          <CardDescription>Export, import, or view change history of your settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <Button className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Export Settings
            </Button>
            <Button className="flex-1">
              <Upload className="mr-2 h-4 w-4" />
              Import Settings
            </Button>
          </div>
          <Button className="w-full" variant="outline">
            <Clock className="mr-2 h-4 w-4" />
            View Change History
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
