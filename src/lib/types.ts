export interface Task {
  id: string;
  title: string;
  completed: boolean;
  category: string;
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