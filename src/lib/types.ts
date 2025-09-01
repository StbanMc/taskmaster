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