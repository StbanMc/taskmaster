export interface Translations {
  // App Header
  appTitle: string;
  appSubtitle: string;
  
  // Task Stats
  tasksCompleted: string;
  overdue: string;
  
  // Add Task Form
  addTaskPlaceholder: string;
  addTaskDescription: string;
  selectCategory: string;
  selectPriority: string;
  high: string;
  medium: string;
  low: string;
  setDueDate: string;
  addTask: string;
  useTemplate: string;
  
  // Task List
  markComplete: string;
  markIncomplete: string;
  editTask: string;
  deleteTask: string;
  selectTask: string;
  deselectTask: string;
  completed: string;
  
  // Categories
  personal: string;
  work: string;
  shopping: string;
  health: string;
  general: string;
  
  // Search and Filters
  searchTasks: string;
  filters: string;
  filterByPriority: string;
  allPriorities: string;
  showCompleted: string;
  showOverdue: string;
  dueDateFilter: string;
  allDates: string;
  today: string;
  tomorrow: string;
  thisWeek: string;
  clearFilters: string;
  
  // Bulk Actions
  selectAll: string;
  deselectAll: string;
  completeSelected: string;
  deleteSelected: string;
  selectMode: string;
  exitSelectMode: string;
  tasksSelected: string;
  
  // Notifications
  taskAddedSuccess: string;
  taskCompletedSuccess: string;
  taskIncomplete: string;
  taskDeleted: string;
  tasksReordered: string;
  
  // Management
  categories: string;
  templates: string;
  notifications: string;
  keyboardShortcuts: string;
  exportData: string;
  
  // Due dates and urgency
  dueTomorrow: string;
  dueToday: string;
  overdueTask: string;
  noDueDate: string;
  
  // Templates
  dailyTasks: string;
  weeklyPlanning: string;
  projectTasks: string;
  
  // Completed tasks section
  completedTasks: string;
  showCompletedTasks: string;
  hideCompletedTasks: string;
  
  // Time formats
  justNow: string;
  minuteAgo: string;
  minutesAgo: string;
  hourAgo: string;
  hoursAgo: string;
  dayAgo: string;
  daysAgo: string;
  
  // Theme
  'theme.light': string;
  'theme.dark': string;
  'theme.system': string;
  'theme.toggleTheme': string;
}

export const translations: Record<string, Translations> = {
  en: {
    // App Header
    appTitle: "TaskFlow",
    appSubtitle: "Organize your life, one task at a time",
    
    // Task Stats
    tasksCompleted: "of {total} tasks completed",
    overdue: "overdue",
    
    // Add Task Form
    addTaskPlaceholder: "Add a new task...",
    addTaskDescription: "Description (optional)",
    selectCategory: "Select category",
    selectPriority: "Priority",
    high: "High",
    medium: "Medium",
    low: "Low",
    setDueDate: "Set due date",
    addTask: "Add Task",
    useTemplate: "Use Template",
    
    // Task List
    markComplete: "Mark as complete",
    markIncomplete: "Mark as incomplete",
    editTask: "Edit task",
    deleteTask: "Delete task",
    selectTask: "Select task",
    deselectTask: "Deselect task",
    completed: "Completed",
    
    // Categories
    personal: "Personal",
    work: "Work",
    shopping: "Shopping",
    health: "Health",
    general: "General",
    
    // Search and Filters
    searchTasks: "Search tasks...",
    filters: "Filters",
    filterByPriority: "Filter by priority",
    allPriorities: "All priorities",
    showCompleted: "Show completed",
    showOverdue: "Show overdue",
    dueDateFilter: "Due date filter",
    allDates: "All dates",
    today: "Today",
    tomorrow: "Tomorrow",
    thisWeek: "This week",
    clearFilters: "Clear all filters",
    
    // Bulk Actions
    selectAll: "Select all",
    deselectAll: "Deselect all",
    completeSelected: "Complete selected",
    deleteSelected: "Delete selected",
    selectMode: "Select mode",
    exitSelectMode: "Exit select mode",
    tasksSelected: "tasks selected",
    
    // Notifications
    taskAddedSuccess: "Task added successfully!",
    taskCompletedSuccess: "Task completed! 🎉",
    taskIncomplete: "Task marked as incomplete",
    taskDeleted: "Task deleted",
    tasksReordered: "Tasks reordered",
    
    // Management
    categories: "Categories",
    templates: "Templates",
    notifications: "Notifications",
    keyboardShortcuts: "Keyboard Shortcuts",
    exportData: "Export Data",
    
    // Due dates and urgency
    dueTomorrow: "Due tomorrow",
    dueToday: "Due today",
    overdueTask: "Overdue",
    noDueDate: "No due date",
    
    // Templates
    dailyTasks: "Daily Tasks",
    weeklyPlanning: "Weekly Planning",
    projectTasks: "Project Tasks",
    
    // Completed tasks section
    completedTasks: "Completed Tasks",
    showCompletedTasks: "Show completed tasks",
    hideCompletedTasks: "Hide completed tasks",
    
    // Time formats
    justNow: "just now",
    minuteAgo: "1 minute ago",
    minutesAgo: "{minutes} minutes ago",
    hourAgo: "1 hour ago",
    hoursAgo: "{hours} hours ago",
    dayAgo: "1 day ago",
    daysAgo: "{days} days ago",
    
    // Theme
    'theme.light': "Light",
    'theme.dark': "Dark",
    'theme.system': "System",
    'theme.toggleTheme': "Toggle theme",
    
    // Achievements and Milestones
    firstFiveTasks: "First Five",
    completedFirstFiveTasks: "Completed your first 5 tasks",
    taskMaster: "Task Master",
    completed25Tasks: "Completed 25 tasks",
    centurion: "Centurion",
    completed100Tasks: "Completed 100 tasks",
    consistentEffort: "Consistent Effort",
    threeDayStreak: "Completed tasks for 3 days in a row",
    weekWarrior: "Week Warrior",
    sevenDayStreak: "Completed tasks for 7 days in a row",
    categoryMaster: "{category} Master",
    clearedAllTasksInCategory: "Cleared all {count} tasks in {category}",
    priorityFocus: "{priority} Priority Focus",
    completedAllPriorityTasks: "Completed all {count} {priority} priority tasks",
    achievements: "Achievements",
    inProgress: "In Progress",
    newAchievement: "New Achievement",
    taskCompleted: "Task Completed",
    hasBeenCompleted: "has been completed"
  },
  
  es: {
    // App Header
    appTitle: "TaskFlow",
    appSubtitle: "Organiza tu vida, una tarea a la vez",
    
    // Task Stats
    tasksCompleted: "de {total} tareas completadas",
    overdue: "vencidas",
    
    // Add Task Form
    addTaskPlaceholder: "Agregar nueva tarea...",
    addTaskDescription: "Descripción (opcional)",
    selectCategory: "Seleccionar categoría",
    selectPriority: "Prioridad",
    high: "Alta",
    medium: "Media",
    low: "Baja",
    setDueDate: "Establecer fecha límite",
    addTask: "Agregar Tarea",
    useTemplate: "Usar Plantilla",
    
    // Task List
    markComplete: "Marcar como completada",
    markIncomplete: "Marcar como incompleta",
    editTask: "Editar tarea",
    deleteTask: "Eliminar tarea",
    selectTask: "Seleccionar tarea",
    deselectTask: "Deseleccionar tarea",
    completed: "Completada",
    
    // Categories
    personal: "Personal",
    work: "Trabajo",
    shopping: "Compras",
    health: "Salud",
    general: "General",
    
    // Search and Filters
    searchTasks: "Buscar tareas...",
    filters: "Filtros",
    filterByPriority: "Filtrar por prioridad",
    allPriorities: "Todas las prioridades",
    showCompleted: "Mostrar completadas",
    showOverdue: "Mostrar vencidas",
    dueDateFilter: "Filtro de fecha límite",
    allDates: "Todas las fechas",
    today: "Hoy",
    tomorrow: "Mañana",
    thisWeek: "Esta semana",
    clearFilters: "Limpiar todos los filtros",
    
    // Bulk Actions
    selectAll: "Seleccionar todo",
    deselectAll: "Deseleccionar todo",
    completeSelected: "Completar seleccionadas",
    deleteSelected: "Eliminar seleccionadas",
    selectMode: "Modo selección",
    exitSelectMode: "Salir del modo selección",
    tasksSelected: "tareas seleccionadas",
    
    // Notifications
    taskAddedSuccess: "¡Tarea agregada exitosamente!",
    taskCompletedSuccess: "¡Tarea completada! 🎉",
    taskIncomplete: "Tarea marcada como incompleta",
    taskDeleted: "Tarea eliminada",
    tasksReordered: "Tareas reordenadas",
    
    // Management
    categories: "Categorías",
    templates: "Plantillas",
    notifications: "Notificaciones",
    keyboardShortcuts: "Atajos de Teclado",
    exportData: "Exportar Datos",
    
    // Due dates and urgency
    dueTomorrow: "Vence mañana",
    dueToday: "Vence hoy",
    overdueTask: "Vencida",
    noDueDate: "Sin fecha límite",
    
    // Templates
    dailyTasks: "Tareas Diarias",
    weeklyPlanning: "Planificación Semanal",
    projectTasks: "Tareas de Proyecto",
    
    // Completed tasks section
    completedTasks: "Tareas Completadas",
    showCompletedTasks: "Mostrar tareas completadas",
    hideCompletedTasks: "Ocultar tareas completadas",
    
    // Time formats
    justNow: "ahora mismo",
    minuteAgo: "hace 1 minuto",
    minutesAgo: "hace {minutes} minutos",
    hourAgo: "hace 1 hora",
    hoursAgo: "hace {hours} horas",
    dayAgo: "hace 1 día",
    daysAgo: "hace {days} días",
    
    // Theme
    'theme.light': "Claro",
    'theme.dark': "Oscuro",
    'theme.system': "Sistema",
    'theme.toggleTheme': "Cambiar tema",
    
    // Achievements and Milestones
    firstFiveTasks: "Primeras Cinco",
    completedFirstFiveTasks: "Completaste tus primeras 5 tareas",
    taskMaster: "Maestro de Tareas",
    completed25Tasks: "Completaste 25 tareas",
    centurion: "Centurión",
    completed100Tasks: "Completaste 100 tareas",
    consistentEffort: "Esfuerzo Constante",
    threeDayStreak: "Completaste tareas por 3 días seguidos",
    weekWarrior: "Guerrero Semanal",
    sevenDayStreak: "Completaste tareas por 7 días seguidos",
    categoryMaster: "Maestro de {category}",
    clearedAllTasksInCategory: "Completaste todas las {count} tareas de {category}",
    priorityFocus: "Enfoque en Prioridad {priority}",
    completedAllPriorityTasks: "Completaste todas las {count} tareas de prioridad {priority}",
    achievements: "Logros",
    inProgress: "En Progreso",
    newAchievement: "Nuevo Logro",
    taskCompleted: "Tarea Completada",
    hasBeenCompleted: "ha sido completada"
  }
};

export const detectBrowserLanguage = (): string => {
  // Get browser language preference
  const browserLang = navigator.language || navigator.languages?.[0] || 'en';
  
  // Extract language code (e.g., 'es-ES' -> 'es')
  const langCode = browserLang.split('-')[0].toLowerCase();
  
  // Return supported language or fallback to English
  return translations[langCode] ? langCode : 'en';
};

export const formatString = (template: string, params: Record<string, string | number>): string => {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return params[key]?.toString() || match;
  });
};

export const getCategoryName = (categoryId: string, t: (key: keyof Translations) => string): string => {
  const categoryMap: Record<string, keyof Translations> = {
    'personal': 'personal',
    'work': 'work',
    'shopping': 'shopping',
    'health': 'health',
    'general': 'general'
  };
  
  return categoryMap[categoryId] ? t(categoryMap[categoryId]) : categoryId;
};

export const getPriorityName = (priority: string, t: (key: keyof Translations) => string): string => {
  const priorityMap: Record<string, keyof Translations> = {
    'high': 'high',
    'medium': 'medium',
    'low': 'low'
  };
  
  return priorityMap[priority] ? t(priorityMap[priority]) : priority;
};