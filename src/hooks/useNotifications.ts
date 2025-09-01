import { useEffect, useRef } from 'react';
import { NotificationManager, NotificationSettings, TaskNotification } from '@/lib/notifications';
import { Task } from '@/lib/types';

interface UseNotificationsProps {
  tasks: Task[];
  settings: NotificationSettings;
  onNotificationUpdate: (notifications: TaskNotification[]) => void;
  onSettingsUpdate: (settings: NotificationSettings) => void;
}

export function useNotifications({
  tasks,
  settings,
  onNotificationUpdate,
  onSettingsUpdate
}: UseNotificationsProps) {
  const managerRef = useRef<NotificationManager | null>(null);

  useEffect(() => {
    // Initialize notification manager
    managerRef.current = new NotificationManager(
      settings,
      onNotificationUpdate,
      onSettingsUpdate
    );

    return () => {
      if (managerRef.current) {
        managerRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    // Update settings when they change
    if (managerRef.current) {
      managerRef.current.updateSettings(settings);
    }
  }, [settings]);

  useEffect(() => {
    // Schedule notifications when tasks change
    if (managerRef.current) {
      managerRef.current.scheduleNotifications(tasks);
    }
  }, [tasks]);

  return {
    dismissNotification: (id: string) => {
      managerRef.current?.dismissNotification(id);
    },
    clearAllNotifications: () => {
      managerRef.current?.clearAllNotifications();
    },
    getActiveNotifications: () => {
      return managerRef.current?.getActiveNotifications() || [];
    },
    getPendingNotifications: () => {
      return managerRef.current?.getPendingNotifications() || [];
    }
  };
}