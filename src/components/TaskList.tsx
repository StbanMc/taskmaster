import { Task, Category, getTaskUrgency } from '@/lib/types';
import { TaskItem } from './TaskItem';
import { SortableTaskList } from './SortableTaskList';
import { Separator } from '@/components/ui/separator';

interface TaskListProps {
  tasks: Task[];
  categories: Category[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onReorderTasks: (tasks: Task[]) => void;
  selectedTasks: string[];
  onSelectTask: (id: string) => void;
  showSelectMode: boolean;
}

export function TaskList({ 
  tasks, 
  categories, 
  onToggleTask, 
  onDeleteTask, 
  onReorderTasks, 
  selectedTasks,
  onSelectTask,
  showSelectMode
}: TaskListProps) {
  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  // Sort pending tasks by urgency (combines priority and due date)
  const sortedPendingTasks = pendingTasks.sort((a, b) => getTaskUrgency(b) - getTaskUrgency(a));

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
        <p className="text-muted-foreground text-lg">No tasks found</p>
        <p className="text-muted-foreground text-sm mt-1">
          Try adjusting your search or filters, or add a new task
        </p>
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
            selectedTasks={selectedTasks}
            onSelectTask={onSelectTask}
            showSelectMode={showSelectMode}
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
                isSelected={selectedTasks.includes(task.id)}
                onSelectToggle={onSelectTask}
                showSelectMode={showSelectMode}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}