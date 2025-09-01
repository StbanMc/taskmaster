import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Bell, Clock, AlertTriangle, X } from '@phosphor-icons/react';
import { TaskNotification, formatNotificationTime } from '@/lib/notifications';
import { Task } from '@/lib/types';

interface NotificationCenterProps {
  notifications: TaskNotification[];
  tasks: Task[];
  onDismissNotification: (id: string) => void;
  onClearAll: () => void;
}

export function NotificationCenter({ 
  notifications, 
  tasks, 
  onDismissNotification, 
  onClearAll 
}: NotificationCenterProps) {
  const activeNotifications = notifications.filter(n => !n.dismissed);
  const pendingNotifications = activeNotifications.filter(n => n.scheduledTime > Date.now());
  const overdueNotifications = activeNotifications.filter(n => n.type === 'overdue');

  if (activeNotifications.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <Bell size={24} className="text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No active notifications</p>
        </CardContent>
      </Card>
    );
  }

  const getTaskById = (taskId: string) => tasks.find(t => t.id === taskId);

  const renderNotification = (notification: TaskNotification) => {
    const task = getTaskById(notification.taskId);
    if (!task) return null;

    const isOverdue = notification.type === 'overdue';
    const isPending = notification.scheduledTime > Date.now();

    return (
      <div
        key={notification.id}
        className={`flex items-start gap-3 p-3 rounded-lg border ${
          isOverdue 
            ? 'border-destructive/20 bg-destructive/5' 
            : 'border-border bg-card'
        }`}
      >
        <div className="flex-shrink-0 mt-0.5">
          {isOverdue ? (
            <AlertTriangle size={16} className="text-destructive" />
          ) : (
            <Clock size={16} className="text-muted-foreground" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-medium text-sm truncate">{task.title}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDismissNotification(notification.id)}
              className="h-6 w-6 p-0 hover:bg-destructive/10"
            >
              <X size={12} />
            </Button>
          </div>
          
          <div className="flex items-center gap-2 mt-1">
            <Badge 
              variant={isOverdue ? "destructive" : "secondary"}
              className="text-xs"
            >
              {isOverdue ? 'Overdue' : formatNotificationTime(notification.scheduledTime)}
            </Badge>
            
            {task.dueDate && (
              <span className="text-xs text-muted-foreground">
                Due: {new Date(task.dueDate).toLocaleDateString()} {new Date(task.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>

          {task.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell size={18} />
            Notifications
            <Badge variant="secondary">{activeNotifications.length}</Badge>
          </CardTitle>
          {activeNotifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="text-xs"
            >
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Overdue Notifications */}
        {overdueNotifications.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle size={14} className="text-destructive" />
              <h4 className="font-medium text-sm text-destructive">
                Overdue Tasks ({overdueNotifications.length})
              </h4>
            </div>
            <div className="space-y-2">
              {overdueNotifications.map(renderNotification)}
            </div>
          </div>
        )}

        {/* Pending Notifications */}
        {pendingNotifications.length > 0 && (
          <>
            {overdueNotifications.length > 0 && <Separator />}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-muted-foreground" />
                <h4 className="font-medium text-sm">
                  Upcoming Reminders ({pendingNotifications.length})
                </h4>
              </div>
              <div className="space-y-2">
                {pendingNotifications
                  .sort((a, b) => a.scheduledTime - b.scheduledTime)
                  .map(renderNotification)}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}