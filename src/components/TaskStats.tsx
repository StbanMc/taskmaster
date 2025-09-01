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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Completion Rate */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Target size={16} className="text-primary" />
            <span className="text-sm font-medium">Progress</span>
          </div>
          <span className="text-2xl font-bold text-primary">{stats.completionRate}%</span>
        </div>
        <Progress value={stats.completionRate} className="h-2" />
        <p className="text-xs text-muted-foreground mt-1">
          {stats.completed} of {stats.total} tasks completed
        </p>
      </Card>

      {/* Due Today */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-blue-600" />
            <span className="text-sm font-medium">Due Today</span>
          </div>
          <span className="text-2xl font-bold text-blue-600">{stats.dueToday}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Tasks requiring attention today
        </p>
      </Card>

      {/* Overdue */}
      {stats.overdue > 0 && (
        <Card className="p-4 border-red-200 bg-red-50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-600" />
              <span className="text-sm font-medium text-red-900">Overdue</span>
            </div>
            <span className="text-2xl font-bold text-red-600">{stats.overdue}</span>
          </div>
          <p className="text-xs text-red-700">
            Tasks past their due date
          </p>
        </Card>
      )}

      {/* Weekly Trend */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-green-600" />
            <span className="text-sm font-medium">This Week</span>
          </div>
          <span className="text-2xl font-bold text-green-600">{stats.thisWeekCompleted}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Tasks completed this week
        </p>
      </Card>

      {/* Priority Breakdown */}
      <Card className="p-4 md:col-span-2 lg:col-span-4">
        <h3 className="text-sm font-medium mb-3">Pending Tasks by Priority</h3>
        <div className="flex gap-4">
          {Object.entries(stats.priorityBreakdown).map(([priority, count]) => {
            const config = getPriorityConfig(priority as any);
            return (
              <Badge
                key={priority}
                variant="secondary"
                className={`flex items-center gap-2 ${config.textColor}`}
              >
                <div className={`w-2 h-2 rounded-full ${config.color}`} />
                {config.label}: {count}
              </Badge>
            );
          })}
        </div>
      </Card>
    </div>
  );
}