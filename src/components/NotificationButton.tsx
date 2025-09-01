import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, BellRinging } from '@phosphor-icons/react';
import { NotificationCenter } from './NotificationCenter';
import { TaskNotification } from '@/lib/notifications';
import { Task } from '@/lib/types';

interface NotificationButtonProps {
  notifications: TaskNotification[];
  tasks: Task[];
  onDismissNotification: (id: string) => void;
  onClearAll: () => void;
}

export function NotificationButton({ 
  notifications, 
  tasks, 
  onDismissNotification, 
  onClearAll 
}: NotificationButtonProps) {
  const activeCount = notifications.filter(n => !n.dismissed).length;
  const hasOverdue = notifications.some(n => !n.dismissed && n.type === 'overdue');

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="relative"
        >
          {hasOverdue ? (
            <BellRinging size={16} className="text-destructive" />
          ) : (
            <Bell size={16} />
          )}
          {activeCount > 0 && (
            <Badge 
              variant={hasOverdue ? "destructive" : "secondary"}
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {activeCount > 99 ? '99+' : activeCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <NotificationCenter
          notifications={notifications}
          tasks={tasks}
          onDismissNotification={onDismissNotification}
          onClearAll={onClearAll}
        />
      </PopoverContent>
    </Popover>
  );
}