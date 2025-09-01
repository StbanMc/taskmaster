export type Priority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  category: string;
  priority: Priority;
  createdAt: number;
  dueDate?: number; // Optional due date timestamp
  completedAt?: number; // When task was completed
  description?: string; // Optional task description
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string; // Phosphor icon name
  isCustom?: boolean; // Track if user created this category
}

export interface TaskTemplate {
  id: string;
  title: string;
  description?: string;
  category: string;
  priority: Priority;
  estimatedDuration?: number; // in minutes
  tags?: string[];
  isRecurring?: boolean;
  recurringType?: 'daily' | 'weekly' | 'monthly';
  createdAt: number;
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'personal', name: 'Personal', color: 'bg-blue-500', icon: 'User' },
  { id: 'work', name: 'Work', color: 'bg-purple-500', icon: 'Briefcase' },
  { id: 'shopping', name: 'Shopping', color: 'bg-green-500', icon: 'ShoppingCart' },
  { id: 'health', name: 'Health', color: 'bg-red-500', icon: 'Heart' },
  { id: 'general', name: 'General', color: 'bg-gray-500', icon: 'List' }
];

export const DEFAULT_TEMPLATES: TaskTemplate[] = [
  {
    id: 'daily-standup',
    title: 'Daily Team Standup',
    description: 'Attend daily team standup meeting',
    category: 'work',
    priority: 'medium',
    estimatedDuration: 15,
    isRecurring: true,
    recurringType: 'daily',
    createdAt: Date.now()
  },
  {
    id: 'workout',
    title: 'Workout Session',
    description: 'Complete daily workout routine',
    category: 'health',
    priority: 'high',
    estimatedDuration: 60,
    tags: ['exercise', 'fitness'],
    isRecurring: true,
    recurringType: 'daily',
    createdAt: Date.now()
  },
  {
    id: 'grocery-shopping',
    title: 'Grocery Shopping',
    description: 'Buy weekly groceries',
    category: 'shopping',
    priority: 'medium',
    estimatedDuration: 90,
    isRecurring: true,
    recurringType: 'weekly',
    createdAt: Date.now()
  },
  {
    id: 'weekly-review',
    title: 'Weekly Review',
    description: 'Review weekly goals and progress',
    category: 'personal',
    priority: 'medium',
    estimatedDuration: 30,
    isRecurring: true,
    recurringType: 'weekly',
    createdAt: Date.now()
  }
];

// Available colors for custom categories
export const CATEGORY_COLORS = [
  'bg-blue-500',
  'bg-purple-500',
  'bg-green-500',
  'bg-red-500',
  'bg-yellow-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-orange-500',
  'bg-teal-500',
  'bg-cyan-500',
  'bg-lime-500',
  'bg-amber-500'
];

// Available icons for custom categories - Simplified and verified list
export const CATEGORY_ICONS = [
  'User',
  'Briefcase',
  'ShoppingCart', 
  'Heart',
  'List',
  'Book',
  'Car',
  'House',
  'MusicNote',
  'Camera',
  'GameController',
  'Barbell', 
  'Coffee',
  'Airplane',
  'Gift',
  'Star',
  'Folder',
  'CalendarBlank',
  'Clock',
  'MapPin',
  'Phone',
  'Envelope',
  'Gear',
  'Palette',
  'LightbulbFilament',
  'Target',
  'Trophy',
  'Rocket'
];

export const PRIORITY_CONFIG = {
  high: { label: 'High', color: 'border-l-red-500 dark:border-l-red-400', textColor: 'text-red-600 dark:text-red-400' },
  medium: { label: 'Medium', color: 'border-l-yellow-500 dark:border-l-yellow-400', textColor: 'text-yellow-600 dark:text-yellow-400' },
  low: { label: 'Low', color: 'border-l-green-500 dark:border-l-green-400', textColor: 'text-green-600 dark:text-green-400' }
} as const;

// Helper function to get priority config safely
export function getPriorityConfig(priority: Priority | undefined): typeof PRIORITY_CONFIG.medium {
  if (!priority || !(priority in PRIORITY_CONFIG)) {
    return PRIORITY_CONFIG.medium;
  }
  return PRIORITY_CONFIG[priority];
}

// Helper function to format dates
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString();
  }
}

// Helper function to check if task is overdue
export function isTaskOverdue(task: Task): boolean {
  if (!task.dueDate || task.completed) return false;
  return task.dueDate < Date.now();
}

// Helper function to get task urgency (combines priority and due date)
export function getTaskUrgency(task: Task): number {
  let urgency = 0;
  
  // Priority scoring
  switch (task.priority) {
    case 'high': urgency += 3; break;
    case 'medium': urgency += 2; break;
    case 'low': urgency += 1; break;
  }
  
  // Due date scoring
  if (task.dueDate && !task.completed) {
    const daysUntilDue = Math.ceil((task.dueDate - Date.now()) / (1000 * 60 * 60 * 24));
    if (daysUntilDue < 0) urgency += 5; // Overdue
    else if (daysUntilDue === 0) urgency += 4; // Due today
    else if (daysUntilDue === 1) urgency += 3; // Due tomorrow
    else if (daysUntilDue <= 3) urgency += 2; // Due within 3 days
  }
  
  return urgency;
}