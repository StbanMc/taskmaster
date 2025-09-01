import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DotsSixVertical, TrashSimple, Calendar, Square, CheckSquare } from '@phosphor-icons/react';
import { Task, Category, getPriorityConfig, formatDate, isTaskOverdue } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SortableTaskItemProps {
  task: Task;
  category: Category | undefined;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  isDragDisabled?: boolean;
  isSelected?: boolean;
  onSelectToggle?: (id: string) => void;
  showSelectMode?: boolean;
}

export function SortableTaskItem({ 
  task, 
  category, 
  onToggle, 
  onDelete, 
  isDragDisabled = false,
  isSelected = false,
  onSelectToggle,
  showSelectMode = false
}: SortableTaskItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    disabled: isDragDisabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityConfig = getPriorityConfig(task.priority);
  const overdue = isTaskOverdue(task);
  
  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={cn(
        "animate-in fade-in slide-in-from-left-4 duration-200",
        isDragging && "opacity-50 z-50"
      )}
    >
      <Card className={cn(
        "p-4 transition-all hover:shadow-md border-l-4",
        task.completed && "opacity-60",
        `border-l-${priorityConfig.color.replace('bg-', '')}`,
        overdue && !task.completed && "bg-red-50 border-red-200",
        isSelected && "ring-2 ring-primary ring-offset-1"
      )}>
        <div className="flex items-start gap-3">
          {showSelectMode && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 mt-0.5"
              onClick={() => onSelectToggle?.(task.id)}
            >
              {isSelected ? <CheckSquare size={16} /> : <Square size={16} />}
            </Button>
          )}

          {!isDragDisabled && (
            <button
              className="text-muted-foreground hover:text-foreground transition-colors cursor-grab active:cursor-grabbing mt-0.5"
              {...attributes}
              {...listeners}
            >
              <DotsSixVertical size={16} />
            </button>
          )}
          
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => onToggle(task.id)}
            className="data-[state=checked]:bg-accent data-[state=checked]:border-accent mt-0.5"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className={cn(
                    "text-sm font-medium transition-all",
                    task.completed && "line-through text-muted-foreground"
                  )}>
                    {task.title}
                  </p>
                  <div className={cn(
                    "w-2 h-2 rounded-full flex-shrink-0",
                    priorityConfig.color
                  )} title={`${priorityConfig.label} priority`} />
                  {overdue && !task.completed && (
                    <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                      Overdue
                    </Badge>
                  )}
                </div>
                
                {task.description && (
                  <p className={cn(
                    "text-xs text-muted-foreground mb-2",
                    task.completed && "line-through"
                  )}>
                    {task.description}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={cn(
                  "text-xs font-medium",
                  priorityConfig.textColor,
                  task.completed && "text-muted-foreground"
                )}>
                  {priorityConfig.label}
                </span>
                {category && (
                  <>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{category.name}</span>
                  </>
                )}
                {task.dueDate && (
                  <>
                    <span className="text-xs text-muted-foreground">•</span>
                    <div className={cn(
                      "flex items-center gap-1 text-xs",
                      overdue && !task.completed ? "text-red-600" : "text-muted-foreground"
                    )}>
                      <Calendar size={12} />
                      {formatDate(task.dueDate)}
                    </div>
                  </>
                )}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(task.id)}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive flex-shrink-0"
              >
                <TrashSimple size={14} />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}