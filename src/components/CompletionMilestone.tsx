import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendUp, Trophy, Target, Lightning } from '@phosphor-icons/react';
import { useI18n } from '@/contexts/I18nContext';
import { Task } from '@/lib/types';

interface CompletionMilestoneProps {
  tasks: Task[];
}

interface Milestone {
  id: string;
  type: 'tasks_completed' | 'streak' | 'category_cleared' | 'priority_cleared';
  title: string;
  description: string;
  icon: React.ReactNode;
  achieved: boolean;
  progress: number;
  target: number;
}

export function CompletionMilestone({ tasks }: CompletionMilestoneProps) {
  const { t } = useI18n();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [recentAchievements, setRecentAchievements] = useState<string[]>([]);

  useEffect(() => {
    const completedTasks = tasks.filter(task => task.completed);
    const completedToday = completedTasks.filter(task => {
      if (!task.completedAt) return false;
      const today = new Date();
      const completedDate = new Date(task.completedAt);
      return completedDate.toDateString() === today.toDateString();
    });

    // Calculate streak (consecutive days with completed tasks)
    const calculateStreak = () => {
      const now = new Date();
      let streak = 0;
      
      for (let i = 0; i < 30; i++) {
        const checkDate = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const hasTasksCompleted = completedTasks.some(task => {
          if (!task.completedAt) return false;
          const completedDate = new Date(task.completedAt);
          return completedDate.toDateString() === checkDate.toDateString();
        });
        
        if (hasTasksCompleted) {
          streak++;
        } else if (i > 0) { // Don't break on first day (today)
          break;
        }
      }
      
      return streak;
    };

    // Get category completion status
    const categoryStats = tasks.reduce((acc, task) => {
      if (!acc[task.category]) {
        acc[task.category] = { total: 0, completed: 0 };
      }
      acc[task.category].total++;
      if (task.completed) {
        acc[task.category].completed++;
      }
      return acc;
    }, {} as Record<string, { total: number; completed: number }>);

    // Get priority completion status
    const priorityStats = tasks.reduce((acc, task) => {
      if (!acc[task.priority]) {
        acc[task.priority] = { total: 0, completed: 0 };
      }
      acc[task.priority].total++;
      if (task.completed) {
        acc[task.priority].completed++;
      }
      return acc;
    }, {} as Record<string, { total: number; completed: number }>);

    const currentStreak = calculateStreak();
    const newMilestones: Milestone[] = [
      // Task completion milestones
      {
        id: 'tasks_5',
        type: 'tasks_completed',
        title: t('firstFiveTasks'),
        description: t('completedFirstFiveTasks'),
        icon: <Target size={20} className="text-blue-500" />,
        achieved: completedTasks.length >= 5,
        progress: Math.min(completedTasks.length, 5),
        target: 5
      },
      {
        id: 'tasks_25',
        type: 'tasks_completed', 
        title: t('taskMaster'),
        description: t('completed25Tasks'),
        icon: <Trophy size={20} className="text-yellow-500" />,
        achieved: completedTasks.length >= 25,
        progress: Math.min(completedTasks.length, 25),
        target: 25
      },
      {
        id: 'tasks_100',
        type: 'tasks_completed',
        title: t('centurion'),
        description: t('completed100Tasks'),
        icon: <Trophy size={20} className="text-purple-500" />,
        achieved: completedTasks.length >= 100,
        progress: Math.min(completedTasks.length, 100),
        target: 100
      },
      // Streak milestones
      {
        id: 'streak_3',
        type: 'streak',
        title: t('consistentEffort'),
        description: t('threeDayStreak'),
        icon: <TrendUp size={20} className="text-green-500" />,
        achieved: currentStreak >= 3,
        progress: Math.min(currentStreak, 3),
        target: 3
      },
      {
        id: 'streak_7',
        type: 'streak',
        title: t('weekWarrior'),
        description: t('sevenDayStreak'),
        icon: <Lightning size={20} className="text-orange-500" />,
        achieved: currentStreak >= 7,
        progress: Math.min(currentStreak, 7),
        target: 7
      },
      // Category clearing milestones
      ...Object.entries(categoryStats)
        .filter(([_, stats]) => stats.total > 0 && stats.completed === stats.total)
        .map(([category, stats]) => ({
          id: `category_${category}`,
          type: 'category_cleared' as const,
          title: t('categoryMaster', { category: category.charAt(0).toUpperCase() + category.slice(1) }),
          description: t('clearedAllTasksInCategory', { category, count: stats.total.toString() }),
          icon: <Target size={20} className="text-indigo-500" />,
          achieved: true,
          progress: stats.completed,
          target: stats.total
        })),
      // Priority clearing milestones
      ...Object.entries(priorityStats)
        .filter(([_, stats]) => stats.total > 0 && stats.completed === stats.total)
        .map(([priority, stats]) => ({
          id: `priority_${priority}`,
          type: 'priority_cleared' as const,
          title: t('priorityFocus', { priority: priority.charAt(0).toUpperCase() + priority.slice(1) }),
          description: t('completedAllPriorityTasks', { priority, count: stats.total.toString() }),
          icon: <Lightning size={20} className="text-red-500" />,
          achieved: true,
          progress: stats.completed,
          target: stats.total
        }))
    ];

    // Check for new achievements
    const previousAchievements = milestones.filter(m => m.achieved).map(m => m.id);
    const currentAchievements = newMilestones.filter(m => m.achieved).map(m => m.id);
    const newAchievements = currentAchievements.filter(id => !previousAchievements.includes(id));
    
    if (newAchievements.length > 0) {
      setRecentAchievements(newAchievements);
      // Clear recent achievements after showing them
      setTimeout(() => setRecentAchievements([]), 5000);
    }

    setMilestones(newMilestones);
  }, [tasks, t, milestones]);

  const achievedMilestones = milestones.filter(m => m.achieved);
  const inProgressMilestones = milestones.filter(m => !m.achieved && m.progress > 0);

  if (achievedMilestones.length === 0 && inProgressMilestones.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Recent achievements notification */}
      {recentAchievements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-accent/10 border border-accent/20 rounded-lg p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Trophy size={20} className="text-accent" />
            <h3 className="font-semibold text-accent">{t('newAchievement')}!</h3>
          </div>
          {recentAchievements.map(achievementId => {
            const milestone = milestones.find(m => m.id === achievementId);
            return milestone ? (
              <div key={achievementId} className="text-sm text-muted-foreground">
                {milestone.title} - {milestone.description}
              </div>
            ) : null;
          })}
        </motion.div>
      )}

      {/* Achieved milestones */}
      {achievedMilestones.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Trophy size={20} className="text-accent" />
            {t('achievements')} ({achievedMilestones.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {achievedMilestones.map(milestone => (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-accent/5 border border-accent/20 rounded-lg p-3"
              >
                <div className="flex items-center gap-2 mb-1">
                  {milestone.icon}
                  <span className="font-medium text-sm">{milestone.title}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  {milestone.description}
                </p>
                <div className="text-xs text-accent font-medium">
                  ✓ {t('completed')}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* In-progress milestones */}
      {inProgressMilestones.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Target size={20} className="text-muted-foreground" />
            {t('inProgress')} ({inProgressMilestones.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {inProgressMilestones.map(milestone => (
              <div
                key={milestone.id}
                className="bg-card border rounded-lg p-3"
              >
                <div className="flex items-center gap-2 mb-1">
                  {milestone.icon}
                  <span className="font-medium text-sm">{milestone.title}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  {milestone.description}
                </p>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>{milestone.progress}/{milestone.target}</span>
                    <span>{Math.round((milestone.progress / milestone.target) * 100)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <motion.div
                      className="bg-accent h-1.5 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(milestone.progress / milestone.target) * 100}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}