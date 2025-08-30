export type Priority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  category: string;
  priority: Priority;
  createdAt: number;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'personal', name: 'Personal', color: 'bg-blue-500' },
  { id: 'work', name: 'Work', color: 'bg-purple-500' },
  { id: 'shopping', name: 'Shopping', color: 'bg-green-500' },
  { id: 'health', name: 'Health', color: 'bg-red-500' },
  { id: 'general', name: 'General', color: 'bg-gray-500' }
];

export const PRIORITY_CONFIG = {
  high: { label: 'High', color: 'bg-red-500', textColor: 'text-red-600' },
  medium: { label: 'Medium', color: 'bg-yellow-500', textColor: 'text-yellow-600' },
  low: { label: 'Low', color: 'bg-green-500', textColor: 'text-green-600' }
} as const;