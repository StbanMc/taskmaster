import { useState } from 'react';
import { MagnifyingGlass, X, FunnelSimple } from '@phosphor-icons/react';
import { Priority, PRIORITY_CONFIG } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useI18n } from '@/contexts/I18nContext';
import { getPriorityName } from '@/lib/i18n';

export interface SearchFilters {
  search: string;
  priority?: Priority;
  showOverdue: boolean;
  showCompleted: boolean;
  dueDateFilter: 'all' | 'today' | 'tomorrow' | 'this-week' | 'overdue';
}

interface TaskSearchProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  hasActiveFilters: boolean;
}

export function TaskSearch({ filters, onFiltersChange, hasActiveFilters }: TaskSearchProps) {
  const { t } = useI18n();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSearchChange = (search: string) => {
    onFiltersChange({ ...filters, search });
  };

  const handlePriorityChange = (priority: string) => {
    onFiltersChange({
      ...filters,
      priority: priority === 'all' ? undefined : priority as Priority
    });
  };

  const handleDueDateFilterChange = (dueDateFilter: string) => {
    onFiltersChange({
      ...filters,
      dueDateFilter: dueDateFilter as SearchFilters['dueDateFilter']
    });
  };

  const handleToggleOverdue = () => {
    onFiltersChange({ ...filters, showOverdue: !filters.showOverdue });
  };

  const handleToggleCompleted = () => {
    onFiltersChange({ ...filters, showCompleted: !filters.showCompleted });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      search: '',
      priority: undefined,
      showOverdue: false,
      showCompleted: true,
      dueDateFilter: 'all'
    });
  };

  return (
    <div className="space-y-3">
      {/* Search Bar */}
      <div className="relative">
        <MagnifyingGlass size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t('searchTasks')}
          value={filters.search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 pr-10"
        />
        {filters.search && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            onClick={() => handleSearchChange('')}
          >
            <X size={14} />
          </Button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <FunnelSimple size={14} className="shrink-0" />
              {t('filters')}
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                  On
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="start">
            <div className="space-y-4">
              <h4 className="font-medium">Filter Tasks</h4>
              
              {/* Priority Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <Select 
                  value={filters.priority || 'all'} 
                  onValueChange={handlePriorityChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    {Object.entries(PRIORITY_CONFIG).map(([priority, config]) => (
                      <SelectItem key={priority} value={priority}>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${config.color}`} />
                          {config.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Due Date Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Due Date</label>
                <Select 
                  value={filters.dueDateFilter} 
                  onValueChange={handleDueDateFilterChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tasks</SelectItem>
                    <SelectItem value="today">Due Today</SelectItem>
                    <SelectItem value="tomorrow">Due Tomorrow</SelectItem>
                    <SelectItem value="this-week">Due This Week</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Toggle Filters */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Show</label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.showCompleted}
                      onChange={handleToggleCompleted}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">Completed tasks</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.showOverdue}
                      onChange={handleToggleOverdue}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">Highlight overdue</span>
                  </label>
                </div>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearAllFilters}
                  className="w-full"
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* Active Filter Badges */}
        {filters.priority && (
          <Badge variant="secondary" className="gap-1">
            Priority: {PRIORITY_CONFIG[filters.priority].label}
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={() => handlePriorityChange('all')}
            >
              <X size={10} />
            </Button>
          </Badge>
        )}

        {filters.dueDateFilter !== 'all' && (
          <Badge variant="secondary" className="gap-1">
            {filters.dueDateFilter === 'today' && 'Due Today'}
            {filters.dueDateFilter === 'tomorrow' && 'Due Tomorrow'}
            {filters.dueDateFilter === 'this-week' && 'Due This Week'}
            {filters.dueDateFilter === 'overdue' && 'Overdue'}
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={() => handleDueDateFilterChange('all')}
            >
              <X size={10} />
            </Button>
          </Badge>
        )}

        {!filters.showCompleted && (
          <Badge variant="secondary" className="gap-1">
            Hide Completed
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={handleToggleCompleted}
            >
              <X size={10} />
            </Button>
          </Badge>
        )}
      </div>
    </div>
  );
}