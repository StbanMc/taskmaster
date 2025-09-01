import { Trash, Calendar, Clock, Square, CheckSquare } from '@phosphor-icons/react';
import { Task, Category, getPriorityConfig, formatDate, isTaskOverdue } from '@/lib/types';
import { getSafeIcon } from '@/lib/icon-validator';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AnimatedCheckbox } from '@/components/AnimatedCheckbox';
import { cn } from '@/lib/utils';
import { useI18n } from '@/contexts/I18nContext';
import { motion } from 'framer-motion';

interface TaskItemProps {
  task: Task;
  category: Category | undefined;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  isSelected?: boolean;
  onSelectToggle?: (id: string) => void;
  showSelectMode?: boolean;
}

export function TaskItem({ 
  task, 
  category, 
  onToggle, 
  onDelete, 
  isSelected = false,
  onSelectToggle,
  showSelectMode = false
}: TaskItemProps) {
  const { t } = useI18n();
  const priorityConfig = getPriorityConfig(task.priority);
  const overdue = isTaskOverdue(task);
  
  const renderCategoryIcon = (iconName: string) => {
    const IconComponent = getSafeIcon(iconName);
    return <IconComponent className="w-3 h-3 text-white drop-shadow-sm" weight="regular" />;
  };
  
  return (
    <motion.div 
      className="animate-in fade-in slide-in-from-left-4 duration-200"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      layout
    >
      <Card className={cn(
        "p-3 md:p-4 transition-all hover:shadow-md border-l-4",
        task.completed && "opacity-60",
        priorityConfig.color,
        overdue && !task.completed && "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800",
        isSelected && "ring-2 ring-primary ring-offset-1"
      )}>
        <div className="flex items-start gap-2 md:gap-3">
          {showSelectMode && (
            <Button
              variant="ghost"
              size="sm"
              className="h-5 w-5 md:h-6 md:w-6 p-0 mt-0.5"
              onClick={() => onSelectToggle?.(task.id)}
              aria-label={isSelected ? t('deselectTask') : t('selectTask')}
            >
              {isSelected ? <CheckSquare size={14} className="shrink-0 md:w-4 md:h-4" /> : <Square size={14} className="shrink-0 md:w-4 md:h-4" />}
            </Button>
          )}
          
          <AnimatedCheckbox
            checked={task.completed}
            onChange={() => onToggle(task.id)}
            size="sm"
            className="mt-0.5 md:mt-1"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1 md:mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-1.5 md:gap-2 mb-1">
                  <p className={cn(
                    "text-xs md:text-sm font-medium transition-all leading-tight",
                    task.completed && "line-through text-muted-foreground"
                  )}>
                    {task.title}
                  </p>
                  <div className={cn(
                    "w-1.5 h-1.5 md:w-2 md:h-2 rounded-full flex-shrink-0",
                    priorityConfig.color
                  )} title={`${priorityConfig.label} priority`} />
                  {overdue && !task.completed && (
                    <Badge variant="destructive" className="text-[10px] md:text-xs px-1 md:px-1.5 py-0.5">
                      Overdue
                    </Badge>
                  )}
                </div>
                
                {task.description && (
                  <p className={cn(
                    "text-[10px] md:text-xs text-muted-foreground mb-1 md:mb-2 leading-tight",
                    task.completed && "line-through"
                  )}>
                    {task.description}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
                <span className={cn(
                  "text-[10px] md:text-xs font-medium",
                  priorityConfig.textColor,
                  task.completed && "text-muted-foreground"
                )}>
                  {priorityConfig.label}
                </span>
                {category && (
                  <>
                    <span className="text-[10px] md:text-xs text-muted-foreground">•</span>
                    <div className="flex items-center gap-1">
                      <div className={cn("w-3 h-3 rounded-sm flex items-center justify-center", category.color)}>
                        {renderCategoryIcon(category.icon)}
                      </div>
                      <span className="text-[10px] md:text-xs text-muted-foreground">{category.name}</span>
                    </div>
                  </>
                )}
                {task.dueDate && (
                  <>
                    <span className="text-[10px] md:text-xs text-muted-foreground">•</span>
                    <div className={cn(
                      "flex items-center gap-1 text-[10px] md:text-xs",
                      overdue && !task.completed ? "text-red-600" : "text-muted-foreground"
                    )}>
                      <Calendar size={10} className="md:w-3 md:h-3 text-current" />
                      {formatDate(task.dueDate)}
                    </div>
                  </>
                )}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(task.id)}
                className="h-6 w-6 md:h-8 md:w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex-shrink-0 transition-colors"
                aria-label={t('deleteTask')}
              >
                <Trash size={12} className="shrink-0 md:w-4 md:h-4 text-current" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}