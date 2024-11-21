import { NavItem } from '@/types';

export type User = {
  id: number;
  name: string;
  company: string;
  role: string;
  verified: boolean;
  status: string;
};
export const users: User[] = [
  {
    id: 1,
    name: 'Candice Schiner',
    company: 'Dell',
    role: 'Frontend Developer',
    verified: false,
    status: 'Active'
  },
  {
    id: 2,
    name: 'John Doe',
    company: 'TechCorp',
    role: 'Backend Developer',
    verified: true,
    status: 'Active'
  },
  {
    id: 3,
    name: 'Alice Johnson',
    company: 'WebTech',
    role: 'UI Designer',
    verified: true,
    status: 'Active'
  },
  {
    id: 4,
    name: 'David Smith',
    company: 'Innovate Inc.',
    role: 'Fullstack Developer',
    verified: false,
    status: 'Inactive'
  },
  {
    id: 5,
    name: 'Emma Wilson',
    company: 'TechGuru',
    role: 'Product Manager',
    verified: true,
    status: 'Active'
  },
  {
    id: 6,
    name: 'James Brown',
    company: 'CodeGenius',
    role: 'QA Engineer',
    verified: false,
    status: 'Active'
  },
  {
    id: 7,
    name: 'Laura White',
    company: 'SoftWorks',
    role: 'UX Designer',
    verified: true,
    status: 'Active'
  },
  {
    id: 8,
    name: 'Michael Lee',
    company: 'DevCraft',
    role: 'DevOps Engineer',
    verified: false,
    status: 'Active'
  },
  {
    id: 9,
    name: 'Olivia Green',
    company: 'WebSolutions',
    role: 'Frontend Developer',
    verified: true,
    status: 'Active'
  },
  {
    id: 10,
    name: 'Robert Taylor',
    company: 'DataTech',
    role: 'Data Analyst',
    verified: false,
    status: 'Active'
  }
];

export type Employee = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string; // Consider using a proper date type if possible
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  longitude?: number; // Optional field
  latitude?: number; // Optional field
  job: string;
  profile_picture?: string | null; // Profile picture can be a string (URL) or null (if no picture)
};

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [] // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Gym',
    url: '#',
    icon: 'gym',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [
      {
        title: 'Workouts',
        url: '/dashboard/workout',
        icon: 'userPen',
        shortcut: ['m', 'm']
      },
      {
        title: 'Gym 3',
        url: '/dashboard/gym-3',
        icon: 'userPen',
        shortcut: ['m', 'm']
      }
    ]
  },
  {
    title: 'Modulo workout exercise',
    url: '#',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [
      {
        title: 'Exercise 1',
        url: '/dashboard/workout-tracker',
        icon: 'userPen',
        shortcut: ['m', 'm']
      }
    ]
  },
  {
    title: 'Modulo Exercise Management',
    url: '#',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [
      {
        title: 'Exercise management',
        url: '/dashboard/exercise-management',
        icon: 'userPen',
        shortcut: ['m', 'm']
      }
    ]
  },
  {
    title: 'Modulo workout-plans-dashboard',
    url: '#',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [
      {
        title: 'Workout plans dashboard',
        url: '/dashboard/workout-plans-dashboard',
        icon: 'userPen',
        shortcut: ['m', 'm']
      }
    ]
  },
  {
    title: 'Modulo management exercise',
    url: '#',
    icon: 'gym',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [
      {
        title: 'Exercise',
        url: '/dashboard/exercise',
        icon: 'userPen',
        shortcut: ['m', 'm']
      },
      {
        title: 'Exercise List',
        url: '/dashboard/list',
        icon: 'userPen',
        shortcut: ['m', 'm']
      },
      {
        title: 'Create Exercise List',
        url: '/dashboard/list-3',
        icon: 'add',
        shortcut: ['c', 'c']
      },
      {
        title: 'List',
        url: '/dashboard/list',
        icon: 'userPen',
        shortcut: ['m', 'm']
      }
    ]
  },
  {
    title: 'Employee',
    url: '/dashboard/employee',
    icon: 'user',
    shortcut: ['e', 'e'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Product',
    url: '/dashboard/product',
    icon: 'product',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Account',
    url: '#', // Placeholder as there is no direct link for the parent
    icon: 'billing',
    isActive: true,

    items: [
      {
        title: 'Profile',
        url: '/dashboard/profile',
        icon: 'userPen',
        shortcut: ['m', 'm']
      },
      {
        title: 'Login',
        shortcut: ['l', 'l'],
        url: '/',
        icon: 'login'
      }
    ]
  },
  {
    title: 'Kanban',
    url: '/dashboard/kanban',
    icon: 'kanban',
    shortcut: ['k', 'k'],
    isActive: false,
    items: [] // No child items
  }
];
