import { Trash2 } from '@phosphor-icons/react';
import { Task, Category } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
  category: Category | undefined;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, category, onToggle, onDelete }: TaskItemProps) {
  return (
    <div className="animate-in fade-in slide-in-from-left-4 duration-200">
      <Card className={cn(
        "p-4 transition-all hover:shadow-md",
        task.completed && "opacity-60"
      )}>
        <div className="flex items-center gap-3">
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => onToggle(task.id)}
            className="data-[state=checked]:bg-accent data-[state=checked]:border-accent"
          />
          
          <div className="flex-1 min-w-0">
            <p className={cn(
              "text-sm font-medium transition-all",
              task.completed && "line-through text-muted-foreground"
            )}>
              {task.title}
            </p>
          </div>
          
          {category && (
            <Badge 
              variant="secondary" 
              className={cn(category.color, "text-white text-xs")}
            >
              {category.name}
            </Badge>
          )}
          
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