import { useState, useMemo, useEffect, useRef } from 'react';
import { useKV } from '@github/spark/hooks';
import { Task, Category, Priority, DEFAULT_CATEGORIES, DEFAULT_TEMPLATES, TaskTemplate, getTaskUrgency, isTaskOverdue } from '@/lib/types';
import { AddTaskForm } from '@/components/AddTaskForm';
import { TaskList } from '@/components/TaskList';
import { CategoryFilter } from '@/components/CategoryFilter';
import { TaskStats } from '@/components/TaskStats';
import { TaskSearch, SearchFilters } from '@/components/TaskSearch';
import { BulkActions } from '@/components/BulkActions';
import { ExportData } from '@/components/ExportData';
import { CategoryManager } from '@/components/CategoryManager';
import { TemplateManager } from '@/components/TemplateManager';
import { KeyboardShortcutsHelp } from '@/components/KeyboardShortcutsHelp';
import { NotificationSettingsDialog } from '@/components/NotificationSettingsDialog';
import { NotificationButton } from '@/components/NotificationButton';
import { LanguageSelector } from '@/components/LanguageSelector';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { CheckCircle, MagnifyingGlass } from '@phosphor-icons/react';
import { Toaster, toast } from 'sonner';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationSettings, TaskNotification, DEFAULT_NOTIFICATION_SETTINGS } from '@/lib/notifications';
import { I18nProvider, useI18n } from '@/contexts/I18nContext';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';

function TaskFlowApp() {
  const { t } = useI18n();
  const { setTheme, theme } = useTheme();
  const [tasks, setTasks] = useKV<Task[]>('taskflow-tasks', []);
  const [categories, setCategories] = useKV<Category[]>('taskflow-categories', DEFAULT_CATEGORIES);
  const [templates, setTemplates] = useKV<TaskTemplate[]>('taskflow-templates', DEFAULT_TEMPLATES);
  const [notificationSettings, setNotificationSettings] = useKV<NotificationSettings>('taskflow-notifications', DEFAULT_NOTIFICATION_SETTINGS);
  const [notifications, setNotifications] = useKV<TaskNotification[]>('taskflow-active-notifications', []);
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

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Initialize notifications system
  const notificationManager = useNotifications({
    tasks,
    settings: notificationSettings,
    onNotificationUpdate: setNotifications,
    onSettingsUpdate: setNotificationSettings
  });

  // Migrate existing tasks and categories to include new fields
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

    if (categories.length > 0) {
      const needsUpdate = categories.some(cat => !cat.icon);
      
      if (needsUpdate) {
        setCategories(currentCategories => 
          currentCategories.map(category => ({
            ...category,
            icon: category.icon || 'List' // Default icon
          }))
        );
      }
    }
  }, [tasks, categories, setTasks, setCategories]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: Date.now()
    };
    setTasks(currentTasks => [...currentTasks, newTask]);
    toast.success(t('taskAddedSuccess'));
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
            toast.success(t('taskCompletedSuccess'));
          } else {
            toast.info(t('taskIncomplete'));
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
    toast.error(t('taskDeleted'));
  };

  const reorderTasks = (reorderedTasks: Task[]) => {
    setTasks(reorderedTasks);
    toast.success(t('tasksReordered'));
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

  // Keyboard shortcuts
  const activeShortcuts = useKeyboardShortcuts([
    {
      key: 'n',
      ctrlKey: true,
      action: () => {
        const input = document.querySelector('input[placeholder*="Add a new task"]') as HTMLInputElement;
        if (input) {
          input.focus();
          input.scrollIntoView({ behavior: 'smooth' });
        }
      },
      description: 'Focus task input to add new task'
    },
    {
      key: '/',
      action: () => {
        const searchInput = document.querySelector('input[placeholder*="Search tasks"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          searchInput.scrollIntoView({ behavior: 'smooth' });
        }
      },
      description: 'Focus search input'
    },
    {
      key: 't',
      ctrlKey: true,
      action: () => {
        const templateButton = document.querySelector('button[aria-label="Open templates"]') as HTMLButtonElement;
        if (templateButton) templateButton.click();
      },
      description: 'Open task templates'
    },
    {
      key: 'a',
      ctrlKey: true,
      action: () => {
        if (!isSelectMode) {
          setIsSelectMode(true);
          setTimeout(() => handleSelectAll(), 100);
        } else {
          handleSelectAll();
        }
      },
      description: 'Select all visible tasks'
    },
    {
      key: 'Escape',
      action: () => {
        if (isSelectMode) {
          setIsSelectMode(false);
          setSelectedTasks([]);
        }
        setActiveCategory(null);
        setSearchFilters({
          search: '',
          priority: undefined,
          showOverdue: false,
          showCompleted: true,
          dueDateFilter: 'all'
        });
      },
      description: 'Clear selection and filters'
    },
    {
      key: '1',
      altKey: true,
      action: () => setActiveCategory('personal'),
      description: 'Filter by Personal category'
    },
    {
      key: '2',
      altKey: true,
      action: () => setActiveCategory('work'),
      description: 'Filter by Work category'
    },
    {
      key: '3',
      altKey: true,
      action: () => setActiveCategory('shopping'),
      description: 'Filter by Shopping category'
    },
    {
      key: '4',
      altKey: true,
      action: () => setActiveCategory('health'),
      description: 'Filter by Health category'
    },
    {
      key: '5',
      altKey: true,
      action: () => setActiveCategory('general'),
      description: 'Filter by General category'
    },
    {
      key: 'd',
      ctrlKey: true,
      action: () => {
        const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
        setTheme(nextTheme);
        toast.success(`Theme changed to ${nextTheme}`);
      },
      description: 'Toggle dark mode'
    }
  ]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <CheckCircle size={32} className="text-primary" />
            <h1 className="text-3xl font-bold text-foreground">{t('appTitle')}</h1>
            <div className="flex items-center gap-2">
              <LanguageSelector />
              <ThemeToggle />
            </div>
          </div>
          <p className="text-muted-foreground">{t('appSubtitle')}</p>
          {totalCount > 0 && (
            <div className="flex items-center justify-center gap-4 mt-2 text-sm text-muted-foreground">
              <span>{completedCount} {t('tasksCompleted', { total: totalCount.toString() })}</span>
              {overdueCount > 0 && (
                <span className="text-red-600 font-medium">
                  {overdueCount} {t('overdue')}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Task Statistics */}
        <TaskStats tasks={tasks} />

        {/* Add Task Form */}
        <div className="mb-6">
          <AddTaskForm 
            onAddTask={addTask} 
            categories={categories} 
            templates={templates}
          />
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
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
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
            
            {/* Management Tools */}
            <div className="flex items-center gap-2 flex-wrap">
              <NotificationButton
                notifications={notifications}
                tasks={tasks}
                onDismissNotification={notificationManager.dismissNotification}
                onClearAll={notificationManager.clearAllNotifications}
              />
              <NotificationSettingsDialog
                settings={notificationSettings}
                onSettingsChange={setNotificationSettings}
              />
              <CategoryManager 
                categories={categories} 
                onUpdateCategories={setCategories} 
                tasks={tasks}
              />
              <TemplateManager
                templates={templates}
                onUpdateTemplates={setTemplates}
                categories={categories}
              />
              <KeyboardShortcutsHelp shortcuts={activeShortcuts} />
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

function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <TaskFlowApp />
      </I18nProvider>
    </ThemeProvider>
  );
}

export default App;