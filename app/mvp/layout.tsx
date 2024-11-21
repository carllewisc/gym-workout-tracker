import KBar from '@/components/kbar';
import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Next Shadcn Dashboard Starter',
  description: 'Basic dashboard with Next.js and Shadcn'
};

import { generateMenuStructure } from '@/utils/menu-generator';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Persisting the sidebar state in the cookie.
  const cookieStore = cookies();
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true';

  const isProduction = process.env.NODE_ENV === 'production';

  // In your layout or navigation component:
  const menuItems2 = [
    {
      title: 'Module Dashboard',
      url: '#',
      icon: 'gym',
      isActive: false,
      shortcut: ['d', 'd'],
      items: [
        {
          title: 'Dashboard',
          url: '/dashboard',
          icon: 'userPen',
          shortcut: ['m', 'm']
        },
        {
          title: 'Home',
          url: '/dashboard/home',
          icon: 'userPen',
          shortcut: ['m', 'm']
        },
        {
          title: 'Basic Training Plan Creator',
          url: '/dashboard/basic-training-plan-creator',
          icon: 'userPen',
          shortcut: ['m', 'm']
        },
        {
          title: 'Training Plans List',
          url: '/dashboard/training-plans-list',
          icon: 'userPen',
          shortcut: ['m', 'm']
        },
        {
          title: 'Employee',
          url: '/dashboard/employee',
          icon: 'userPen',
          shortcut: ['m', 'm']
        },
        {
          title: 'Exercise',
          url: '/dashboard/exercise',
          icon: 'userPen',
          shortcut: ['m', 'm']
        },
        {
          title: 'Exercise Management',
          url: '/dashboard/exercise-management',
          icon: 'userPen',
          shortcut: ['m', 'm']
        },
        {
          title: 'Gym 3',
          url: '/dashboard/gym-3',
          icon: 'userPen',
          shortcut: ['m', 'm']
        },
        {
          title: 'Kanban',
          url: '/dashboard/kanban',
          icon: 'userPen',
          shortcut: ['m', 'm']
        },
        {
          title: 'List',
          url: '/dashboard/list',
          icon: 'userPen',
          shortcut: ['m', 'm']
        },
        {
          title: 'List 3',
          url: '/dashboard/list-3',
          icon: 'userPen',
          shortcut: ['m', 'm']
        },
        {
          title: 'Overview',
          url: '/dashboard/overview',
          icon: 'userPen',
          shortcut: ['m', 'm']
        },
        {
          title: 'Product',
          url: '/dashboard/product',
          icon: 'userPen',
          shortcut: ['m', 'm']
        },
        {
          title: 'Profile',
          url: '/dashboard/profile',
          icon: 'userPen',
          shortcut: ['m', 'm']
        },
        {
          title: 'Workout Plans Dashboard',
          url: '/dashboard/workout-plans-dashboard',
          icon: 'userPen',
          shortcut: ['m', 'm']
        },
        {
          title: 'Workout Tracker',
          url: '/dashboard/workout-tracker',
          icon: 'userPen',
          shortcut: ['m', 'm']
        }
      ]
    },
    {
      title: 'Module Finance',
      url: '#',
      icon: 'gym',
      isActive: false,
      shortcut: ['d', 'd'],
      items: [
        {
          title: 'Finance',
          url: '/finance',
          icon: 'userPen',
          shortcut: ['m', 'm']
        },
        {
          title: 'Overview',
          url: '/finance/overview',
          icon: 'userPen',
          shortcut: ['m', 'm']
        }
      ]
    },
    {
      title: 'Module Mvp',
      url: '#',
      icon: 'gym',
      isActive: false,
      shortcut: ['d', 'd'],
      items: [
        {
          title: 'Mvp',
          url: '/mvp',
          icon: 'userPen',
          shortcut: ['m', 'm']
        },
        {
          title: 'Create',
          url: '/mvp/create',
          icon: 'userPen',
          shortcut: ['m', 'm']
        },
        {
          title: 'Workout Analytics',
          url: '/mvp/workout-analytics',
          icon: 'userPen',
          shortcut: ['m', 'm']
        },
        {
          title: 'Workout Tracker',
          url: '/mvp/workout-tracker',
          icon: 'userPen',
          shortcut: ['m', 'm']
        }
      ]
    }
  ];

  const menuItems = isProduction ? menuItems2 : generateMenuStructure();
  console.log(JSON.stringify(menuItems, null, 2));

  return (
    <KBar>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar menuItems={menuItems} />
        <SidebarInset>
          <Header />
          {/* page main content */}
          {children}
          {/* page main content ends */}
        </SidebarInset>
      </SidebarProvider>
    </KBar>
  );
}
