import { motion, AnimatePresence } from 'framer-motion';
import { Task, Category } from '@/lib/types';
import { TaskItem } from './TaskItem';
import { Separator } from '@/components/ui/separator';

interface TaskListProps {
  tasks: Task[];
  categories: Category[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export function TaskList({ tasks, categories, onToggleTask, onDeleteTask }: TaskListProps) {
  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  const getCategoryById = (categoryId: string) => 
    categories.find(cat => cat.id === categoryId);

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No tasks yet</p>
        <p className="text-muted-foreground text-sm mt-1">Add your first task to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pending Tasks */}
      {pendingTasks.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            To Do ({pendingTasks.length})
          </h2>
          <AnimatePresence>
            {pendingTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                category={getCategoryById(task.category)}
                onToggle={onToggleTask}
                onDelete={onDeleteTask}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Separator */}
      {pendingTasks.length > 0 && completedTasks.length > 0 && (
        <Separator className="my-6" />
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-muted-foreground">
            Completed ({completedTasks.length})
          </h2>
          <AnimatePresence>
            {completedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                category={getCategoryById(task.category)}
                onToggle={onToggleTask}
                onDelete={onDeleteTask}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}