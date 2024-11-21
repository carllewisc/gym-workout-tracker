"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Search, Users, UserPlus, AlertCircle, MoreVertical, Send, Download, Trash2, Lock, CreditCard, PauseCircle, Bell } from 'lucide-react'

// Mock data for users
const mockUsers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', avatar: '/placeholder-avatar.jpg', registrationDate: '2023-01-15', lastActive: '2024-03-10', subscriptionStatus: 'Active', workoutCount: 120, activeStreak: 15, accountStatus: 'Active', userType: 'Premium' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', avatar: null, registrationDate: '2023-02-20', lastActive: '2024-03-09', subscriptionStatus: 'Inactive', workoutCount: 85, activeStreak: 0, accountStatus: 'Suspended', userType: 'Free' },
  { id: '3', name: 'Alice Johnson', email: 'alice@example.com', avatar: '/placeholder-avatar.jpg', registrationDate: '2023-03-05', lastActive: '2024-03-10', subscriptionStatus: 'Active', workoutCount: 200, activeStreak: 30, accountStatus: 'Active', userType: 'Premium' },
  // Add more mock users as needed
]

type User = {
  id: string
  name: string
  email: string
  avatar: string | null
  registrationDate: string
  lastActive: string
  subscriptionStatus: 'Active' | 'Inactive'
  workoutCount: number
  activeStreak: number
  accountStatus: 'Active' | 'Suspended'
  userType: 'Free' | 'Premium'
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [subscriptionFilter, setSubscriptionFilter] = useState<string | null>(null)
  const [userTypeFilter, setUserTypeFilter] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const { toast } = useToast()

  const filteredUsers = users.filter(user =>
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!statusFilter || user.accountStatus === statusFilter) &&
    (!subscriptionFilter || user.subscriptionStatus === subscriptionFilter) &&
    (!userTypeFilter || user.userType === userTypeFilter)
  )

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prevSelected =>
      prevSelected.includes(userId)
        ? prevSelected.filter(id => id !== userId)
        : [...prevSelected, userId]
    )
  }

  const handleSelectAllUsers = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedUsers(event.target.checked ? filteredUsers.map(user => user.id) : [])
  }

  const handleUserAction = (action: string, userId: string) => {
    // Implement user actions here
    toast({
      title: "User Action",
      description: `${action} action performed on user ${userId}`,
    })
  }

  const handleBulkAction = (action: string) => {
    // Implement bulk actions here
    toast({
      title: "Bulk Action",
      description: `${action} action performed on ${selectedUsers.length} users`,
    })
    setSelectedUsers([])
  }

  const openUserDetails = (user: User) => {
    setSelectedUser(user)
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-3xl font-bold">User Management</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users Today</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Users This Week</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users Requiring Attention</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-2 md:space-y-0">
        <div className="flex-1 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full"
            />
          </div>
        </div>
        <div className="flex space-x-2 w-full md:w-auto">
          <Select value={statusFilter || ''} onValueChange={(value) => setStatusFilter(value || null)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Account Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
          <Select value={subscriptionFilter || ''} onValueChange={(value) => setSubscriptionFilter(value || null)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Subscription" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Subscriptions</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Select value={userTypeFilter || ''} onValueChange={(value) => setUserTypeFilter(value || null)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="User Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="Free">Free</SelectItem>
              <SelectItem value="Premium">Premium</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedUsers.length > 0 && (
        <div className="mb-4 flex space-x-2">
          <Button variant="outline" onClick={() => handleBulkAction('notify')}>
            <Send className="mr-2 h-4 w-4" />
            Notify Selected
          </Button>
          <Button variant="outline" onClick={() => handleBulkAction('export')}>
            <Download className="mr-2 h-4 w-4" />
            Export Selected
          </Button>
          <Button variant="destructive" onClick={() => handleBulkAction('delete')}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Selected
          </Button>
        </div>
      )}

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedUsers.length === filteredUsers.length}
                    onCheckedChange={handleSelectAllUsers}
                  />
                </TableHead>
                <TableHead>User</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead>Workouts</TableHead>
                <TableHead>Streak</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={() => handleSelectUser(user.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar>
                        <AvatarImage src={user.avatar || undefined} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.registrationDate}</TableCell>
                  <TableCell>{user.lastActive}</TableCell>
                  <TableCell>
                    <Badge variant={user.subscriptionStatus === 'Active' ? 'default' : 'secondary'}>
                      {user.subscriptionStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.workoutCount}</TableCell>
                  <TableCell>{user.activeStreak} days</TableCell>
                  <TableCell>
                    <Badge variant={user.accountStatus === 'Active' ? 'default' : 'destructive'}>
                      {user.accountStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.userType}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openUserDetails(user)}>View Details</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUserAction('resetPassword', user.id)}>Reset Password</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUserAction('changePlan', user.id)}>Change Plan</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUserAction('suspend', user.id)}>Suspend Account</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUserAction('notify', user.id)}>Send Notification</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUserAction('export', user.id)}>Export Data</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Detailed information and actions for {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="workouts">Workouts</TabsTrigger>
                <TabsTrigger value="progress">Progress</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
                <TabsTrigger value="support">Support</TabsTrigger>
              </TabsList>
              <TabsContent value="profile">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input id="name" value={selectedUser.name} className="col-span-3" readOnly />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input id="email" value={selectedUser.email} className="col-span-3" readOnly />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="registrationDate" className="text-right">
                      Registration Date
                    </Label>
                    <Input id="registrationDate" value={selectedUser.registrationDate} className="col-span-3" readOnly />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="lastActive" className="text-right">
                      Last Active
                    </Label>
                    <Input id="lastActive" value={selectedUser.lastActive} className="col-span-3" readOnly />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="userType" className="text-right">
                      User Type
                    </Label>
                    <Input id="userType" value={selectedUser.userType} className="col-span-3" readOnly />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="workouts">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Recent Workouts</h4>
                  <ScrollArea className="h-[200px] w-full rounded-md border">
                    <div className="p-4">
                      <p>Workout history will be displayed here.</p>
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>
              <TabsContent value="progress">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Progress Metrics</h4>
                  <ScrollArea className="h-[200px] w-full rounded-md border">
                    <div className="p-4">
                      <p>User progress metrics and charts will be displayed here.</p>
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>
              <TabsContent value="payments">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Payment History</h4>
                  <ScrollArea className="h-[200px] w-full rounded-md border">
                    <div className="p-4">
                      <p>Payment history and subscription details will be displayed here.</p>
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>
              <TabsContent value="support">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Support Tickets</h4>
                  <ScrollArea className="h-[200px] w-full rounded-md border">
                    <div className="p-4">
                      <p>User support tickets and communication history will be displayed here.</p>
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>
            </Tabs>
          )}
          <DialogFooter className="sm:justify-start">
            <Button variant="outline" onClick={() => handleUserAction('resetPassword', selectedUser?.id || '')}>
              <Lock className="mr-2 h-4 w-4" />
              Reset Password
            </Button>
            <Button variant="outline" onClick={() => handleUserAction('changePlan', selectedUser?.id || '')}>
              <CreditCard className="mr-2 h-4 w-4" />
              Change Plan
            </Button>
            <Button variant="outline" onClick={() => handleUserAction('suspend', selectedUser?.id || '')}>
              <PauseCircle className="mr-2 h-4 w-4" />
              Suspend Account
            </Button>
            <Button variant="outline" onClick={() => handleUserAction('notify', selectedUser?.id || '')}>
              <Bell className="mr-2 h-4 w-4" />
              Send Notification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}