import { Task } from './types';

export interface NotificationSettings {
  enabled: boolean;
  reminderTimes: number[]; // Minutes before due date
  showBrowserNotifications: boolean;
  playSound: boolean;
  soundVolume: number;
}

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: true,
  reminderTimes: [60, 15, 0], // 1 hour, 15 minutes, at due time
  showBrowserNotifications: true,
  playSound: false,
  soundVolume: 0.5
};

export interface TaskNotification {
  id: string;
  taskId: string;
  type: 'reminder' | 'overdue';
  scheduledTime: number;
  reminderMinutes: number;
  dismissed: boolean;
  created: number;
}

export class NotificationManager {
  private settings: NotificationSettings;
  private notifications: TaskNotification[] = [];
  private intervalId: number | null = null;
  private onNotificationUpdate?: (notifications: TaskNotification[]) => void;
  private onSettingsUpdate?: (settings: NotificationSettings) => void;

  constructor(
    initialSettings: NotificationSettings,
    onNotificationUpdate?: (notifications: TaskNotification[]) => void,
    onSettingsUpdate?: (settings: NotificationSettings) => void
  ) {
    this.settings = initialSettings;
    this.onNotificationUpdate = onNotificationUpdate;
    this.onSettingsUpdate = onSettingsUpdate;
    this.requestNotificationPermission();
    this.startMonitoring();
  }

  async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  updateSettings(newSettings: NotificationSettings) {
    this.settings = newSettings;
    this.onSettingsUpdate?.(newSettings);
    
    if (this.settings.enabled) {
      this.startMonitoring();
    } else {
      this.stopMonitoring();
    }
  }

  scheduleNotifications(tasks: Task[]) {
    if (!this.settings.enabled) return;

    // Clear existing notifications for these tasks
    const taskIds = new Set(tasks.map(t => t.id));
    this.notifications = this.notifications.filter(n => !taskIds.has(n.taskId));

    const now = Date.now();

    tasks.forEach(task => {
      if (task.completed || !task.dueDate) return;

      this.settings.reminderTimes.forEach(reminderMinutes => {
        const scheduledTime = task.dueDate! - (reminderMinutes * 60 * 1000);
        
        // Only schedule future notifications
        if (scheduledTime > now) {
          const notification: TaskNotification = {
            id: `${task.id}-${reminderMinutes}`,
            taskId: task.id,
            type: 'reminder',
            scheduledTime,
            reminderMinutes,
            dismissed: false,
            created: now
          };
          this.notifications.push(notification);
        }
      });

      // Schedule overdue notification for 1 minute after due date
      const overdueTime = task.dueDate + (1 * 60 * 1000);
      if (overdueTime > now) {
        const overdueNotification: TaskNotification = {
          id: `${task.id}-overdue`,
          taskId: task.id,
          type: 'overdue',
          scheduledTime: overdueTime,
          reminderMinutes: -1,
          dismissed: false,
          created: now
        };
        this.notifications.push(overdueNotification);
      }
    });

    this.onNotificationUpdate?.(this.notifications);
  }

  private startMonitoring() {
    if (this.intervalId) return;

    this.intervalId = window.setInterval(() => {
      this.checkNotifications();
    }, 30000); // Check every 30 seconds
  }

  private stopMonitoring() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private async checkNotifications() {
    const now = Date.now();
    const dueNotifications = this.notifications.filter(
      n => !n.dismissed && n.scheduledTime <= now
    );

    for (const notification of dueNotifications) {
      await this.showNotification(notification);
      notification.dismissed = true;
    }

    if (dueNotifications.length > 0) {
      this.onNotificationUpdate?.(this.notifications);
    }
  }

  private async showNotification(notification: TaskNotification) {
    // Get task details (this would need to be passed from the parent component)
    const { taskId, type, reminderMinutes } = notification;

    let title: string;
    let message: string;
    let icon = '/favicon.ico';

    if (type === 'reminder') {
      if (reminderMinutes === 0) {
        title = 'Task Due Now!';
        message = 'A task is due right now';
      } else if (reminderMinutes === 1) {
        title = 'Task Due in 1 Minute';
        message = 'A task is due very soon';
      } else if (reminderMinutes < 60) {
        title = `Task Due in ${reminderMinutes} Minutes`;
        message = 'Don\'t forget about your upcoming task';
      } else {
        const hours = Math.floor(reminderMinutes / 60);
        title = `Task Due in ${hours} Hour${hours > 1 ? 's' : ''}`;
        message = 'You have an upcoming task';
      }
    } else {
      title = 'Task Overdue!';
      message = 'A task has passed its due date';
    }

    // Show browser notification
    if (this.settings.showBrowserNotifications && 'Notification' in window && Notification.permission === 'granted') {
      const browserNotification = new Notification(title, {
        body: message,
        icon,
        tag: notification.id,
        requireInteraction: type === 'overdue'
      });

      browserNotification.onclick = () => {
        window.focus();
        browserNotification.close();
      };

      // Auto-close after 5 seconds for reminders
      if (type === 'reminder') {
        setTimeout(() => {
          browserNotification.close();
        }, 5000);
      }
    }

    // Play sound
    if (this.settings.playSound) {
      this.playNotificationSound();
    }
  }

  private playNotificationSound() {
    try {
      // Create a simple beep sound using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      gainNode.gain.setValueAtTime(this.settings.soundVolume, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.warn('Could not play notification sound:', error);
    }
  }

  dismissNotification(notificationId: string) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.dismissed = true;
      this.onNotificationUpdate?.(this.notifications);
    }
  }

  clearAllNotifications() {
    this.notifications = [];
    this.onNotificationUpdate?.([]);
  }

  getActiveNotifications(): TaskNotification[] {
    return this.notifications.filter(n => !n.dismissed);
  }

  getPendingNotifications(): TaskNotification[] {
    const now = Date.now();
    return this.notifications.filter(n => !n.dismissed && n.scheduledTime > now);
  }

  destroy() {
    this.stopMonitoring();
    this.clearAllNotifications();
  }
}

export function formatNotificationTime(scheduledTime: number): string {
  const now = Date.now();
  const diff = scheduledTime - now;

  if (diff <= 0) {
    return 'Now';
  }

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `in ${days} day${days > 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `in ${hours} hour${hours > 1 ? 's' : ''}`;
  } else if (minutes > 0) {
    return `in ${minutes} minute${minutes > 1 ? 's' : ''}`;
  } else {
    return 'very soon';
  }
}