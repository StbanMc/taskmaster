import { useState, useMemo, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { Task, Category, Priority, DEFAULT_CATEGORIES, getTaskUrgency, isTaskOverdue } from '@/lib/types';
import { AddTaskForm } from '@/components/AddTaskForm';
import { TaskList } from '@/components/TaskList';
import { CategoryFilter } from '@/components/CategoryFilter';
import { TaskStats } from '@/components/TaskStats';
import { TaskSearch, SearchFilters } from '@/components/TaskSearch';
import { BulkActions } from '@/components/BulkActions';
import { ExportData } from '@/components/ExportData';
import { Separator } from '@/components/ui/separator';
import { CheckCircle } from '@phosphor-icons/react';
import { Toaster, toast } from 'sonner';

function App() {
  const [tasks, setTasks] = useKV<Task[]>('taskflow-tasks', []);
  const [categories] = useKV<Category[]>('taskflow-categories', DEFAULT_CATEGORIES);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    search: '',
    priority: undefined,
    showOverdue: false,
    showCompleted: true,
    dueDateFilter: 'all'
  });

  // Migrate existing tasks to include new fields
  useEffect(() => {
    if (tasks.length > 0) {
      const needsUpdate = tasks.some(task => 
        !task.priority || 
        !['high', 'medium', 'low'].includes(task.priority) ||
        (task.completed && !task.completedAt)
      );
      
      if (needsUpdate) {
        setTasks(currentTasks => 
          currentTasks.map(task => ({
            ...task,
            priority: (task.priority && ['high', 'medium', 'low'].includes(task.priority)) 
              ? task.priority 
              : 'medium' as Priority,
            completedAt: task.completed && !task.completedAt ? Date.now() : task.completedAt
          }))
        );
      }
    }
  }, [tasks, setTasks]);

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
          const updated = { 
            ...task, 
            completed: !task.completed,
            completedAt: !task.completed ? Date.now() : undefined
          };
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
    setSelectedTasks(current => current.filter(id => id !== taskId));
    toast.error('Task deleted');
  };

  const reorderTasks = (reorderedTasks: Task[]) => {
    setTasks(reorderedTasks);
    toast.success('Tasks reordered');
  };

  // Selection handlers
  const handleSelectTask = (taskId: string) => {
    setSelectedTasks(current => 
      current.includes(taskId) 
        ? current.filter(id => id !== taskId)
        : [...current, taskId]
    );
  };

  const handleSelectAll = () => {
    setSelectedTasks(filteredTasks.map(task => task.id));
  };

  const handleDeselectAll = () => {
    setSelectedTasks([]);
  };

  const handleToggleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
    if (isSelectMode) {
      setSelectedTasks([]);
    }
  };

  // Filtering logic
  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Category filter
    if (activeCategory) {
      filtered = filtered.filter(task => task.category === activeCategory);
    }

    // Search filter
    if (searchFilters.search) {
      const searchTerm = searchFilters.search.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchTerm) ||
        (task.description && task.description.toLowerCase().includes(searchTerm))
      );
    }

    // Priority filter
    if (searchFilters.priority) {
      filtered = filtered.filter(task => task.priority === searchFilters.priority);
    }

    // Completed filter
    if (!searchFilters.showCompleted) {
      filtered = filtered.filter(task => !task.completed);
    }

    // Due date filter
    if (searchFilters.dueDateFilter !== 'all') {
      const now = Date.now();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);

      filtered = filtered.filter(task => {
        if (!task.dueDate) return false;
        const taskDate = new Date(task.dueDate);
        
        switch (searchFilters.dueDateFilter) {
          case 'today':
            return taskDate >= today && taskDate < tomorrow;
          case 'tomorrow':
            return taskDate >= tomorrow && taskDate < new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000);
          case 'this-week':
            return taskDate >= today && taskDate < nextWeek;
          case 'overdue':
            return task.dueDate < now && !task.completed;
          default:
            return true;
        }
      });
    }

    // Sort by urgency (priority + due date)
    return filtered.sort((a, b) => {
      // Completed tasks go to bottom
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;
      
      // For incomplete tasks, sort by urgency
      if (!a.completed && !b.completed) {
        return getTaskUrgency(b) - getTaskUrgency(a);
      }
      
      // For completed tasks, sort by completion date
      return (b.completedAt || 0) - (a.completedAt || 0);
    });
  }, [tasks, activeCategory, searchFilters]);

  const taskCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    tasks.forEach(task => {
      if (!task.completed) {
        counts[task.category] = (counts[task.category] || 0) + 1;
      }
    });
    return counts;
  }, [tasks]);

  const hasActiveFilters = useMemo(() => {
    return !!(
      searchFilters.search ||
      searchFilters.priority ||
      !searchFilters.showCompleted ||
      searchFilters.dueDateFilter !== 'all' ||
      activeCategory
    );
  }, [searchFilters, activeCategory]);

  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;
  const overdueCount = tasks.filter(task => isTaskOverdue(task)).length;

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
            <div className="flex items-center justify-center gap-4 mt-2 text-sm text-muted-foreground">
              <span>{completedCount} of {totalCount} tasks completed</span>
              {overdueCount > 0 && (
                <span className="text-red-600 font-medium">
                  {overdueCount} overdue
                </span>
              )}
            </div>
          )}
        </div>

        {/* Task Statistics */}
        <TaskStats tasks={tasks} />

        {/* Add Task Form */}
        <div className="mb-6">
          <AddTaskForm onAddTask={addTask} categories={categories} />
        </div>

        {/* Search and Filters */}
        {tasks.length > 0 && (
          <div className="mb-6">
            <TaskSearch
              filters={searchFilters}
              onFiltersChange={setSearchFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </div>
        )}

        {/* Action Bar */}
        {tasks.length > 0 && (
          <div className="flex items-center justify-between mb-6">
            {/* Bulk Actions */}
            <div className="flex-1">
              <BulkActions
                selectedTasks={selectedTasks}
                tasks={filteredTasks}
                onToggleTask={toggleTask}
                onDeleteTask={deleteTask}
                onSelectAll={handleSelectAll}
                onDeselectAll={handleDeselectAll}
                isSelectMode={isSelectMode}
                onToggleSelectMode={handleToggleSelectMode}
              />
            </div>
            
            {/* Export */}
            <div className="ml-4">
              <ExportData tasks={tasks} categories={categories} />
            </div>
          </div>
        )}

        {/* Category Filter */}
        {tasks.length > 0 && !hasActiveFilters && (
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
          onReorderTasks={reorderTasks}
          selectedTasks={selectedTasks}
          onSelectTask={handleSelectTask}
          showSelectMode={isSelectMode}
        />
      </div>
      <Toaster position="bottom-center" />
    </div>
  );
}

export default App;