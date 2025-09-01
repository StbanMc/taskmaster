import { useMemo } from 'react';
import { Task, isTaskOverdue, getPriorityConfig } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, Target, TrendingUp, AlertTriangle } from '@phosphor-icons/react';

interface TaskStatsProps {
  tasks: Task[];
}

export function TaskStats({ tasks }: TaskStatsProps) {
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const overdue = tasks.filter(t => isTaskOverdue(t)).length;
    const dueToday = tasks.filter(t => {
      if (!t.dueDate || t.completed) return false;
      const today = new Date();
      const taskDate = new Date(t.dueDate);
      return taskDate.toDateString() === today.toDateString();
    }).length;
    
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    // Priority breakdown
    const priorityBreakdown = {
      high: tasks.filter(t => !t.completed && t.priority === 'high').length,
      medium: tasks.filter(t => !t.completed && t.priority === 'medium').length,
      low: tasks.filter(t => !t.completed && t.priority === 'low').length
    };
    
    // Weekly completion trend (simplified)
    const thisWeekCompleted = tasks.filter(t => {
      if (!t.completedAt) return false;
      const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      return t.completedAt > weekAgo;
    }).length;
    
    return {
      total,
      completed,
      overdue,
      dueToday,
      completionRate,
      priorityBreakdown,
      thisWeekCompleted
    };
  }, [tasks]);

  if (stats.total === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
      {/* Completion Rate */}
      <Card className="p-3 md:p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 md:gap-2">
            <Target size={14} className="text-primary md:w-4 md:h-4" />
            <span className="text-xs md:text-sm font-medium">Progress</span>
          </div>
          <span className="text-lg md:text-2xl font-bold text-primary">{stats.completionRate}%</span>
        </div>
        <Progress value={stats.completionRate} className="h-1.5 md:h-2" />
        <p className="text-[10px] md:text-xs text-muted-foreground mt-1">
          {stats.completed} of {stats.total} tasks
        </p>
      </Card>

      {/* Due Today */}
      <Card className="p-3 md:p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 md:gap-2">
            <Clock size={14} className="text-blue-600 md:w-4 md:h-4" />
            <span className="text-xs md:text-sm font-medium">Today</span>
          </div>
          <span className="text-lg md:text-2xl font-bold text-blue-600">{stats.dueToday}</span>
        </div>
        <p className="text-[10px] md:text-xs text-muted-foreground">
          Due today
        </p>
      </Card>

      {/* Overdue */}
      {stats.overdue > 0 && (
        <Card className="p-3 md:p-4 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 md:gap-2">
              <AlertTriangle size={14} className="text-red-600 md:w-4 md:h-4" />
              <span className="text-xs md:text-sm font-medium text-red-900 dark:text-red-300">Overdue</span>
            </div>
            <span className="text-lg md:text-2xl font-bold text-red-600">{stats.overdue}</span>
          </div>
          <p className="text-[10px] md:text-xs text-red-700 dark:text-red-400">
            Past due
          </p>
        </Card>
      )}

      {/* Weekly Trend */}
      <Card className="p-3 md:p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 md:gap-2">
            <TrendingUp size={14} className="text-green-600 md:w-4 md:h-4" />
            <span className="text-xs md:text-sm font-medium">Week</span>
          </div>
          <span className="text-lg md:text-2xl font-bold text-green-600">{stats.thisWeekCompleted}</span>
        </div>
        <p className="text-[10px] md:text-xs text-muted-foreground">
          This week
        </p>
      </Card>

      {/* Priority Breakdown */}
      <Card className="p-3 md:p-4 col-span-2 md:col-span-2 lg:col-span-4">
        <h3 className="text-xs md:text-sm font-medium mb-2 md:mb-3">Pending by Priority</h3>
        <div className="flex gap-2 md:gap-4 flex-wrap">
          {Object.entries(stats.priorityBreakdown).map(([priority, count]) => {
            const config = getPriorityConfig(priority as any);
            return (
              <Badge
                key={priority}
                variant="secondary"
                className={`flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs px-2 py-1 ${config.textColor}`}
              >
                <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${config.color}`} />
                {config.label}: {count}
              </Badge>
            );
          })}
        </div>
      </Card>
    </div>
  );
}