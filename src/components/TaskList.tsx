import { useState } from 'react';
import { Task, Category, getTaskUrgency } from '@/lib/types';
import { TaskItem } from './TaskItem';
import { SortableTaskList } from './SortableTaskList';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, CheckCircle } from '@phosphor-icons/react';
import { useI18n } from '@/contexts/I18nContext';
import { AnimatePresence, motion } from 'framer-motion';

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
  const { t } = useI18n();
  const [showCompleted, setShowCompleted] = useState(false);
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

      {/* Completed Tasks - Collapsible */}
      {completedTasks.length > 0 && (
        <div className="space-y-3">
          <Collapsible open={showCompleted} onOpenChange={setShowCompleted}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-between p-0 h-auto font-semibold text-muted-foreground hover:text-foreground"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle size={20} />
                  <span>{t('completedTasks')} ({completedTasks.length})</span>
                </div>
                {showCompleted ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 mt-3">
              <AnimatePresence>
                {completedTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <TaskItem
                      task={task}
                      category={getCategoryById(task.category)}
                      onToggle={onToggleTask}
                      onDelete={onDeleteTask}
                      isSelected={selectedTasks.includes(task.id)}
                      onSelectToggle={onSelectTask}
                      showSelectMode={showSelectMode}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </CollapsibleContent>
          </Collapsible>
        </div>
      )}
    </div>
  );
}