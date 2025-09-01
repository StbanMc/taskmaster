import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Bell, X, Plus } from '@phosphor-icons/react';
import { NotificationSettings } from '@/lib/notifications';

interface NotificationSettingsDialogProps {
  settings: NotificationSettings;
  onSettingsChange: (settings: NotificationSettings) => void;
}

export function NotificationSettingsDialog({ settings, onSettingsChange }: NotificationSettingsDialogProps) {
  const [localSettings, setLocalSettings] = useState<NotificationSettings>(settings);
  const [customReminderInput, setCustomReminderInput] = useState('');

  const handleSave = () => {
    onSettingsChange(localSettings);
  };

  const addReminderTime = () => {
    const minutes = parseInt(customReminderInput);
    if (isNaN(minutes) || minutes < 0) return;
    
    if (!localSettings.reminderTimes.includes(minutes)) {
      setLocalSettings({
        ...localSettings,
        reminderTimes: [...localSettings.reminderTimes, minutes].sort((a, b) => b - a)
      });
    }
    setCustomReminderInput('');
  };

  const removeReminderTime = (minutes: number) => {
    setLocalSettings({
      ...localSettings,
      reminderTimes: localSettings.reminderTimes.filter(m => m !== minutes)
    });
  };

  const formatReminderTime = (minutes: number) => {
    if (minutes === 0) return 'At due time';
    if (minutes === 1) return '1 minute before';
    if (minutes < 60) return `${minutes} minutes before`;
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} before`;
    } else {
      return `${hours}h ${remainingMinutes}m before`;
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setLocalSettings({
          ...localSettings,
          showBrowserNotifications: true
        });
        // Show test notification
        new Notification('TaskFlow Notifications Enabled!', {
          body: 'You\'ll now receive reminders for your tasks.',
          icon: '/favicon.ico'
        });
      }
    }
  };

  const isNotificationSupported = 'Notification' in window;
  const hasNotificationPermission = isNotificationSupported && Notification.permission === 'granted';

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Bell size={16} className="mr-1" />
          Notifications
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Notification Settings</DialogTitle>
          <DialogDescription>
            Configure reminders and alerts for your tasks
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Enable Notifications */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Enable Notifications</label>
              <p className="text-xs text-muted-foreground">
                Get reminded about upcoming and overdue tasks
              </p>
            </div>
            <Switch
              checked={localSettings.enabled}
              onCheckedChange={(enabled) => 
                setLocalSettings({ ...localSettings, enabled })
              }
            />
          </div>

          {localSettings.enabled && (
            <>
              <Separator />

              {/* Browser Notifications */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">Browser Notifications</label>
                    <p className="text-xs text-muted-foreground">
                      Show system notifications even when app is closed
                    </p>
                  </div>
                  <Switch
                    checked={localSettings.showBrowserNotifications && hasNotificationPermission}
                    onCheckedChange={(enabled) => {
                      if (enabled && !hasNotificationPermission) {
                        requestNotificationPermission();
                      } else {
                        setLocalSettings({ 
                          ...localSettings, 
                          showBrowserNotifications: enabled 
                        });
                      }
                    }}
                    disabled={!isNotificationSupported}
                  />
                </div>
                
                {!hasNotificationPermission && isNotificationSupported && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={requestNotificationPermission}
                    className="w-full"
                  >
                    Enable Browser Notifications
                  </Button>
                )}
                
                {!isNotificationSupported && (
                  <p className="text-xs text-muted-foreground">
                    Browser notifications not supported
                  </p>
                )}
              </div>

              {/* Sound Notifications */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">Sound Alerts</label>
                    <p className="text-xs text-muted-foreground">
                      Play a sound when notifications appear
                    </p>
                  </div>
                  <Switch
                    checked={localSettings.playSound}
                    onCheckedChange={(playSound) => 
                      setLocalSettings({ ...localSettings, playSound })
                    }
                  />
                </div>

                {localSettings.playSound && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Volume</label>
                    <Slider
                      value={[localSettings.soundVolume * 100]}
                      onValueChange={([value]) =>
                        setLocalSettings({ 
                          ...localSettings, 
                          soundVolume: value / 100 
                        })
                      }
                      max={100}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Quiet</span>
                      <span>Loud</span>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Reminder Times */}
              <div className="space-y-3">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Reminder Times</label>
                  <p className="text-xs text-muted-foreground">
                    When to remind you before tasks are due
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {localSettings.reminderTimes.map((minutes) => (
                    <Badge
                      key={minutes}
                      variant="secondary"
                      className="flex items-center gap-1 pr-1"
                    >
                      {formatReminderTime(minutes)}
                      <button
                        onClick={() => removeReminderTime(minutes)}
                        className="ml-1 hover:bg-destructive/20 rounded-sm p-0.5"
                      >
                        <X size={10} />
                      </button>
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Minutes"
                    value={customReminderInput}
                    onChange={(e) => setCustomReminderInput(e.target.value)}
                    className="flex-1 px-2 py-1 text-sm border rounded-md bg-background"
                    min="0"
                    max="10080" // 1 week
                  />
                  <Button
                    size="sm"
                    onClick={addReminderTime}
                    disabled={!customReminderInput || isNaN(parseInt(customReminderInput))}
                  >
                    <Plus size={14} />
                  </Button>
                </div>
                
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• 0 = At due time</p>
                  <p>• 60 = 1 hour before</p>
                  <p>• 1440 = 1 day before</p>
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <DialogTrigger asChild>
              <Button variant="outline">Cancel</Button>
            </DialogTrigger>
            <DialogTrigger asChild>
              <Button onClick={handleSave}>Save Settings</Button>
            </DialogTrigger>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}