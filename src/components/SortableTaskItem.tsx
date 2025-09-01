import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DotsSixVertical, Trash2 } from '@phosphor-icons/react';
import { Task, Category, getPriorityConfig } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SortableTaskItemProps {
  task: Task;
  category: Category | undefined;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  isDragDisabled?: boolean;
}

export function SortableTaskItem({ 
  task, 
  category, 
  onToggle, 
  onDelete, 
  isDragDisabled = false 
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
        task.priority === 'high' && "border-l-red-500",
        task.priority === 'medium' && "border-l-yellow-500", 
        task.priority === 'low' && "border-l-green-500",
        !task.priority && "border-l-gray-300"
      )}>
        <div className="flex items-center gap-3">
          {!isDragDisabled && (
            <button
              className="text-muted-foreground hover:text-foreground transition-colors cursor-grab active:cursor-grabbing"
              {...attributes}
              {...listeners}
            >
              <DotsSixVertical size={16} />
            </button>
          )}
          
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => onToggle(task.id)}
            className="data-[state=checked]:bg-accent data-[state=checked]:border-accent"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className={cn(
                "text-sm font-medium transition-all",
                task.completed && "line-through text-muted-foreground"
              )}>
                {task.title}
              </p>
              <div className={cn(
                "w-2 h-2 rounded-full",
                priorityConfig.color
              )} title={`${priorityConfig.label} priority`} />
            </div>
            <div className="flex items-center gap-2">
              <span className={cn(
                "text-xs font-medium",
                priorityConfig.textColor,
                task.completed && "text-muted-foreground"
              )}>
                {priorityConfig.label} Priority
              </span>
              {category && (
                <>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{category.name}</span>
                </>
              )}
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(task.id)}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </Card>
    </div>
  );
}