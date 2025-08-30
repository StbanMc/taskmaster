import { Task, Category } from '@/lib/types';
import { TaskItem } from './TaskItem';
import { SortableTaskList } from './SortableTaskList';
import { Separator } from '@/components/ui/separator';

interface TaskListProps {
  tasks: Task[];
  categories: Category[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onReorderTasks: (tasks: Task[]) => void;
}

export function TaskList({ tasks, categories, onToggleTask, onDeleteTask, onReorderTasks }: TaskListProps) {
  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  // Sort pending tasks by priority (high -> medium -> low)
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  const sortedPendingTasks = pendingTasks.sort((a, b) => {
    const aPriority = priorityOrder[a.priority || 'medium'];
    const bPriority = priorityOrder[b.priority || 'medium'];
    return aPriority - bPriority;
  });

  const getCategoryById = (categoryId: string) => 
    categories.find(cat => cat.id === categoryId);

  const handleReorderPendingTasks = (reorderedPendingTasks: Task[]) => {
    // Combine reordered pending tasks with unchanged completed tasks
    const allTasks = [...reorderedPendingTasks, ...completedTasks];
    onReorderTasks(allTasks);
  };

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
      {sortedPendingTasks.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            To Do ({sortedPendingTasks.length})
          </h2>
          <SortableTaskList
            tasks={sortedPendingTasks}
            categories={categories}
            onToggleTask={onToggleTask}
            onDeleteTask={onDeleteTask}
            onReorderTasks={handleReorderPendingTasks}
          />
        </div>
      )}

      {/* Separator */}
      {sortedPendingTasks.length > 0 && completedTasks.length > 0 && (
        <Separator className="my-6" />
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-muted-foreground">
            Completed ({completedTasks.length})
          </h2>
          <div className="space-y-2">
            {completedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                category={getCategoryById(task.category)}
                onToggle={onToggleTask}
                onDelete={onDeleteTask}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}