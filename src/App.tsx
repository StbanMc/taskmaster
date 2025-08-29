import { useState, useMemo } from 'react';
import { useKV } from '@github/spark/hooks';
import { Task, Category, DEFAULT_CATEGORIES } from '@/lib/types';
import { AddTaskForm } from '@/components/AddTaskForm';
import { TaskList } from '@/components/TaskList';
import { CategoryFilter } from '@/components/CategoryFilter';
import { Separator } from '@/components/ui/separator';
import { CheckCircle } from '@phosphor-icons/react';
import { Toaster, toast } from 'sonner';

function App() {
  const [tasks, setTasks] = useKV<Task[]>('taskflow-tasks', []);
  const [categories] = useKV<Category[]>('taskflow-categories', DEFAULT_CATEGORIES);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: Date.now()
    };
    setTasks(currentTasks => [...currentTasks, newTask]);
    toast.success('Task added successfully!');
  };

  const toggleTask = (taskId: string) => {
    setTasks(currentTasks =>
      currentTasks.map(task => {
        if (task.id === taskId) {
          const updated = { ...task, completed: !task.completed };
          if (updated.completed) {
            toast.success('Task completed! 🎉');
          } else {
            toast.info('Task marked as incomplete');
          }
          return updated;
        }
        return task;
      })
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks(currentTasks => currentTasks.filter(task => task.id !== taskId));
    toast.error('Task deleted');
  };

  const filteredTasks = useMemo(() => {
    if (!activeCategory) return tasks;
    return tasks.filter(task => task.category === activeCategory);
  }, [tasks, activeCategory]);

  const taskCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    tasks.forEach(task => {
      if (!task.completed) {
        counts[task.category] = (counts[task.category] || 0) + 1;
      }
    });
    return counts;
  }, [tasks]);

  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <CheckCircle size={32} className="text-primary" />
            <h1 className="text-3xl font-bold text-foreground">TaskFlow</h1>
          </div>
          <p className="text-muted-foreground">Organize your life, one task at a time</p>
          {totalCount > 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              {completedCount} of {totalCount} tasks completed
            </p>
          )}
        </div>

        {/* Add Task Form */}
        <div className="mb-6">
          <AddTaskForm onAddTask={addTask} categories={categories} />
        </div>

        {/* Category Filter */}
        {tasks.length > 0 && (
          <>
            <div className="mb-6">
              <CategoryFilter
                categories={categories}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
                taskCounts={taskCounts}
              />
            </div>
            <Separator className="mb-6" />
          </>
        )}

        {/* Task List */}
        <TaskList
          tasks={filteredTasks}
          categories={categories}
          onToggleTask={toggleTask}
          onDeleteTask={deleteTask}
        />
      </div>
      <Toaster position="bottom-center" />
    </div>
  );
}

export default App;