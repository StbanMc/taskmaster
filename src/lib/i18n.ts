// Translation system for TaskFlow app
export type Language = 'en' | 'es';

export interface Translation {
  // Common
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  add: string;
  create: string;
  close: string;
  search: string;
  clear: string;
  loading: string;
  of: string;
  
  // App header
  appTitle: string;
  appSubtitle: string;
  tasksCompleted: string;
  overdue: string;
  
  // Task form
  addNewTask: string;
  taskTitle: string;
  taskDescription: string;
  category: string;
  priority: string;
  dueDate: string;
  addTask: string;
  
  // Priorities
  high: string;
  medium: string;
  low: string;
  
  // Categories
  personal: string;
  work: string;
  shopping: string;
  health: string;
  general: string;
  
  // Search and filters
  searchTasks: string;
  filterByPriority: string;
  filterByDueDate: string;
  allTasks: string;
  today: string;
  tomorrow: string;
  thisWeek: string;
  overdueTasks: string;
  clearFilters: string;
  filters: string;
  
  // Bulk actions
  selectMode: string;
  selected: string;
  selectAll: string;
  deselectAll: string;
  markCompleted: string;
  markIncomplete: string;
  deleteSelected: string;
  
  // Task list
  noTasks: string;
  allTasksCompleted: string;
  greatJobCompleted: string;
  completedTasks: string;
  showCompleted: string;
  hideCompleted: string;
  
  // Task actions
  markComplete: string;
  markIncomplete: string;
  editTask: string;
  deleteTask: string;
  taskCompleted: string;
  taskIncomplete: string;
  taskDeleted: string;
  taskUpdated: string;
  tasksReordered: string;
  
  // Categories manager
  manageCategories: string;
  categoryManager: string;
  categoryName: string;
  categoryColor: string;
  categoryIcon: string;
  addCategory: string;
  editCategory: string;
  deleteCategory: string;
  categoryAdded: string;
  categoryUpdated: string;
  categoryDeleted: string;
  cannotDeleteCategory: string;
  
  // Templates
  templates: string;
  templateManager: string;
  taskTemplates: string;
  templateName: string;
  templateDescription: string;
  addTemplate: string;
  editTemplate: string;
  deleteTemplate: string;
  templateAdded: string;
  templateUpdated: string;
  templateDeleted: string;
  useTemplate: string;
  
  // Notifications
  notifications: string;
  notificationSettings: string;
  enableNotifications: string;
  reminderTime: string;
  minutes: string;
  hours: string;
  days: string;
  notifyOverdue: string;
  notifyUpcoming: string;
  dismissNotification: string;
  clearAllNotifications: string;
  taskDueSoon: string;
  taskOverdue: string;
  
  // Export
  exportData: string;
  exportTasks: string;
  dataExported: string;
  
  // Keyboard shortcuts
  keyboardShortcuts: string;
  shortcutHelp: string;
  newTask: string;
  searchShortcut: string;
  openTemplates: string;
  selectAllTasks: string;
  clearSelection: string;
  personalCategory: string;
  workCategory: string;
  shoppingCategory: string;
  healthCategory: string;
  generalCategory: string;
  
  // Stats
  totalTasks: string;
  pendingTasks: string;
  highPriorityTasks: string;
  overdueTasksCount: string;
  completionRate: string;
  
  // Time/Date
  createdAt: string;
  dueIn: string;
  minutesAgo: string;
  hoursAgo: string;
  daysAgo: string;
  due: string;
  noDueDate: string;
  
  // Messages
  taskAddedSuccess: string;
  enterTaskTitle: string;
  selectCategory: string;
  confirmDeleteTask: string;
  confirmDeleteSelected: string;
  confirmDeleteCategory: string;
  confirmDeleteTemplate: string;
  noTasksFound: string;
  noTasksInCategory: string;
}

export const translations: Record<Language, Translation> = {
  en: {
    // Common
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    create: 'Create',
    close: 'Close',
    search: 'Search',
    clear: 'Clear',
    loading: 'Loading...',
    of: 'of',
    
    // App header
    appTitle: 'TaskFlow',
    appSubtitle: 'Organize your life, one task at a time',
    tasksCompleted: 'tasks completed',
    overdue: 'overdue',
    
    // Task form
    addNewTask: 'Add a new task',
    taskTitle: 'Task title',
    taskDescription: 'Task description (optional)',
    category: 'Category',
    priority: 'Priority',
    dueDate: 'Due date',
    addTask: 'Add Task',
    
    // Priorities
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    
    // Categories
    personal: 'Personal',
    work: 'Work',
    shopping: 'Shopping',
    health: 'Health',
    general: 'General',
    
    // Search and filters
    searchTasks: 'Search tasks...',
    filterByPriority: 'Filter by priority',
    filterByDueDate: 'Filter by due date',
    allTasks: 'All tasks',
    today: 'Today',
    tomorrow: 'Tomorrow',
    thisWeek: 'This week',
    overdueTasks: 'Overdue',
    clearFilters: 'Clear filters',
    filters: 'Filters',
    
    // Bulk actions
    selectMode: 'Select Mode',
    selected: 'selected',
    selectAll: 'Select All',
    deselectAll: 'Deselect All',
    markCompleted: 'Mark Completed',
    markIncomplete: 'Mark Incomplete',
    deleteSelected: 'Delete Selected',
    
    // Task list
    noTasks: 'No tasks yet. Create your first task above!',
    allTasksCompleted: 'All tasks completed! 🎉',
    greatJobCompleted: 'Great job! Completed tasks are shown at the bottom.',
    completedTasks: 'Completed Tasks',
    showCompleted: 'Show completed tasks',
    hideCompleted: 'Hide completed tasks',
    
    // Task actions
    markComplete: 'Mark as complete',
    markIncomplete: 'Mark as incomplete',
    editTask: 'Edit task',
    deleteTask: 'Delete task',
    taskCompleted: 'Task completed! 🎉',
    taskIncomplete: 'Task marked as incomplete',
    taskDeleted: 'Task deleted',
    taskUpdated: 'Task updated',
    tasksReordered: 'Tasks reordered',
    
    // Categories manager
    manageCategories: 'Manage Categories',
    categoryManager: 'Category Manager',
    categoryName: 'Category name',
    categoryColor: 'Category color',
    categoryIcon: 'Category icon',
    addCategory: 'Add Category',
    editCategory: 'Edit Category',
    deleteCategory: 'Delete Category',
    categoryAdded: 'Category added',
    categoryUpdated: 'Category updated',
    categoryDeleted: 'Category deleted',
    cannotDeleteCategory: 'Cannot delete category with existing tasks',
    
    // Templates
    templates: 'Templates',
    templateManager: 'Template Manager',
    taskTemplates: 'Task Templates',
    templateName: 'Template name',
    templateDescription: 'Template description',
    addTemplate: 'Add Template',
    editTemplate: 'Edit Template',
    deleteTemplate: 'Delete Template',
    templateAdded: 'Template added',
    templateUpdated: 'Template updated',
    templateDeleted: 'Template deleted',
    useTemplate: 'Use Template',
    
    // Notifications
    notifications: 'Notifications',
    notificationSettings: 'Notification Settings',
    enableNotifications: 'Enable Notifications',
    reminderTime: 'Reminder Time',
    minutes: 'minutes',
    hours: 'hours',
    days: 'days',
    notifyOverdue: 'Notify when overdue',
    notifyUpcoming: 'Notify upcoming tasks',
    dismissNotification: 'Dismiss notification',
    clearAllNotifications: 'Clear all notifications',
    taskDueSoon: 'Task due soon',
    taskOverdue: 'Task is overdue',
    
    // Export
    exportData: 'Export Data',
    exportTasks: 'Export Tasks',
    dataExported: 'Data exported successfully',
    
    // Keyboard shortcuts
    keyboardShortcuts: 'Keyboard Shortcuts',
    shortcutHelp: 'Keyboard Shortcuts Help',
    newTask: 'Focus task input to add new task',
    searchShortcut: 'Focus search input',
    openTemplates: 'Open task templates',
    selectAllTasks: 'Select all visible tasks',
    clearSelection: 'Clear selection and filters',
    personalCategory: 'Filter by Personal category',
    workCategory: 'Filter by Work category',
    shoppingCategory: 'Filter by Shopping category',
    healthCategory: 'Filter by Health category',
    generalCategory: 'Filter by General category',
    
    // Stats
    totalTasks: 'Total Tasks',
    pendingTasks: 'Pending Tasks',
    highPriorityTasks: 'High Priority',
    overdueTasksCount: 'Overdue Tasks',
    completionRate: 'Completion Rate',
    
    // Time/Date
    createdAt: 'Created at',
    dueIn: 'Due in',
    minutesAgo: 'minutes ago',
    hoursAgo: 'hours ago',
    daysAgo: 'days ago',
    due: 'Due',
    noDueDate: 'No due date',
    
    // Messages
    taskAddedSuccess: 'Task added successfully!',
    enterTaskTitle: 'Please enter a task title',
    selectCategory: 'Please select a category',
    confirmDeleteTask: 'Are you sure you want to delete this task?',
    confirmDeleteSelected: 'Are you sure you want to delete the selected tasks?',
    confirmDeleteCategory: 'Are you sure you want to delete this category?',
    confirmDeleteTemplate: 'Are you sure you want to delete this template?',
    noTasksFound: 'No tasks found matching your search',
    noTasksInCategory: 'No tasks in this category'
  },
  es: {
    // Common
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    add: 'Agregar',
    create: 'Crear',
    close: 'Cerrar',
    search: 'Buscar',
    clear: 'Limpiar',
    loading: 'Cargando...',
    of: 'de',
    
    // App header
    appTitle: 'TaskFlow',
    appSubtitle: 'Organiza tu vida, una tarea a la vez',
    tasksCompleted: 'tareas completadas',
    overdue: 'vencidas',
    
    // Task form
    addNewTask: 'Agregar una nueva tarea',
    taskTitle: 'Título de la tarea',
    taskDescription: 'Descripción de la tarea (opcional)',
    category: 'Categoría',
    priority: 'Prioridad',
    dueDate: 'Fecha límite',
    addTask: 'Agregar Tarea',
    
    // Priorities
    high: 'Alta',
    medium: 'Media',
    low: 'Baja',
    
    // Categories
    personal: 'Personal',
    work: 'Trabajo',
    shopping: 'Compras',
    health: 'Salud',
    general: 'General',
    
    // Search and filters
    searchTasks: 'Buscar tareas...',
    filterByPriority: 'Filtrar por prioridad',
    filterByDueDate: 'Filtrar por fecha límite',
    allTasks: 'Todas las tareas',
    today: 'Hoy',
    tomorrow: 'Mañana',
    thisWeek: 'Esta semana',
    overdueTasks: 'Vencidas',
    clearFilters: 'Limpiar filtros',
    filters: 'Filtros',
    
    // Bulk actions
    selectMode: 'Modo Selección',
    selected: 'seleccionadas',
    selectAll: 'Seleccionar Todo',
    deselectAll: 'Deseleccionar Todo',
    markCompleted: 'Marcar Completadas',
    markIncomplete: 'Marcar Incompletas',
    deleteSelected: 'Eliminar Seleccionadas',
    
    // Task list
    noTasks: '¡Aún no hay tareas. Crea tu primera tarea arriba!',
    allTasksCompleted: '¡Todas las tareas completadas! 🎉',
    greatJobCompleted: '¡Buen trabajo! Las tareas completadas se muestran abajo.',
    completedTasks: 'Tareas Completadas',
    showCompleted: 'Mostrar tareas completadas',
    hideCompleted: 'Ocultar tareas completadas',
    
    // Task actions
    markComplete: 'Marcar como completada',
    markIncomplete: 'Marcar como incompleta',
    editTask: 'Editar tarea',
    deleteTask: 'Eliminar tarea',
    taskCompleted: '¡Tarea completada! 🎉',
    taskIncomplete: 'Tarea marcada como incompleta',
    taskDeleted: 'Tarea eliminada',
    taskUpdated: 'Tarea actualizada',
    tasksReordered: 'Tareas reordenadas',
    
    // Categories manager
    manageCategories: 'Gestionar Categorías',
    categoryManager: 'Gestor de Categorías',
    categoryName: 'Nombre de la categoría',
    categoryColor: 'Color de la categoría',
    categoryIcon: 'Ícono de la categoría',
    addCategory: 'Agregar Categoría',
    editCategory: 'Editar Categoría',
    deleteCategory: 'Eliminar Categoría',
    categoryAdded: 'Categoría agregada',
    categoryUpdated: 'Categoría actualizada',
    categoryDeleted: 'Categoría eliminada',
    cannotDeleteCategory: 'No se puede eliminar la categoría con tareas existentes',
    
    // Templates
    templates: 'Plantillas',
    templateManager: 'Gestor de Plantillas',
    taskTemplates: 'Plantillas de Tareas',
    templateName: 'Nombre de la plantilla',
    templateDescription: 'Descripción de la plantilla',
    addTemplate: 'Agregar Plantilla',
    editTemplate: 'Editar Plantilla',
    deleteTemplate: 'Eliminar Plantilla',
    templateAdded: 'Plantilla agregada',
    templateUpdated: 'Plantilla actualizada',
    templateDeleted: 'Plantilla eliminada',
    useTemplate: 'Usar Plantilla',
    
    // Notifications
    notifications: 'Notificaciones',
    notificationSettings: 'Configuración de Notificaciones',
    enableNotifications: 'Habilitar Notificaciones',
    reminderTime: 'Tiempo de Recordatorio',
    minutes: 'minutos',
    hours: 'horas',
    days: 'días',
    notifyOverdue: 'Notificar cuando esté vencida',
    notifyUpcoming: 'Notificar tareas próximas',
    dismissNotification: 'Descartar notificación',
    clearAllNotifications: 'Limpiar todas las notificaciones',
    taskDueSoon: 'Tarea vence pronto',
    taskOverdue: 'Tarea está vencida',
    
    // Export
    exportData: 'Exportar Datos',
    exportTasks: 'Exportar Tareas',
    dataExported: 'Datos exportados exitosamente',
    
    // Keyboard shortcuts
    keyboardShortcuts: 'Atajos de Teclado',
    shortcutHelp: 'Ayuda de Atajos de Teclado',
    newTask: 'Enfocar entrada de tarea para agregar nueva tarea',
    searchShortcut: 'Enfocar entrada de búsqueda',
    openTemplates: 'Abrir plantillas de tareas',
    selectAllTasks: 'Seleccionar todas las tareas visibles',
    clearSelection: 'Limpiar selección y filtros',
    personalCategory: 'Filtrar por categoría Personal',
    workCategory: 'Filtrar por categoría Trabajo',
    shoppingCategory: 'Filtrar por categoría Compras',
    healthCategory: 'Filtrar por categoría Salud',
    generalCategory: 'Filtrar por categoría General',
    
    // Stats
    totalTasks: 'Total de Tareas',
    pendingTasks: 'Tareas Pendientes',
    highPriorityTasks: 'Prioridad Alta',
    overdueTasksCount: 'Tareas Vencidas',
    completionRate: 'Tasa de Finalización',
    
    // Time/Date
    createdAt: 'Creada el',
    dueIn: 'Vence en',
    minutesAgo: 'minutos atrás',
    hoursAgo: 'horas atrás',
    daysAgo: 'días atrás',
    due: 'Vence',
    noDueDate: 'Sin fecha límite',
    
    // Messages
    taskAddedSuccess: '¡Tarea agregada exitosamente!',
    enterTaskTitle: 'Por favor ingresa un título para la tarea',
    selectCategory: 'Por favor selecciona una categoría',
    confirmDeleteTask: '¿Estás seguro de que quieres eliminar esta tarea?',
    confirmDeleteSelected: '¿Estás seguro de que quieres eliminar las tareas seleccionadas?',
    confirmDeleteCategory: '¿Estás seguro de que quieres eliminar esta categoría?',
    confirmDeleteTemplate: '¿Estás seguro de que quieres eliminar esta plantilla?',
    noTasksFound: 'No se encontraron tareas que coincidan con tu búsqueda',
    noTasksInCategory: 'No hay tareas en esta categoría'
  }
};

// Translation hook
export function useTranslation(language: Language) {
  return {
    t: translations[language],
    language
  };
}

// Helper function to get translation
export function getTranslation(language: Language, key: keyof Translation): string {
  return translations[language][key];
}

// Helper function to get priority config with translation
export function getPriorityConfigWithTranslation(priority: Priority, language: Language) {
  const baseConfig = {
    high: { color: 'bg-red-500', textColor: 'text-red-600' },
    medium: { color: 'bg-yellow-500', textColor: 'text-yellow-600' },
    low: { color: 'bg-green-500', textColor: 'text-green-600' }
  } as const;
  
  const labels = {
    high: getTranslation(language, 'high'),
    medium: getTranslation(language, 'medium'),
    low: getTranslation(language, 'low')
  };
  
  return {
    ...baseConfig[priority],
    label: labels[priority]
  };
}

// Helper function to get category name with translation
export function getCategoryNameWithTranslation(categoryId: string, language: Language) {
  const categoryTranslations: Record<string, keyof Translation> = {
    personal: 'personal',
    work: 'work',
    shopping: 'shopping',
    health: 'health',
    general: 'general'
  };
  
  if (categoryId in categoryTranslations) {
    return getTranslation(language, categoryTranslations[categoryId]);
  }
  
  // Return the original category name for custom categories
  return categoryId;
}