import { useState } from 'react';
import { Task } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash, CheckCircle, XCircle, Square, CheckSquare } from '@phosphor-icons/react';
import { toast } from 'sonner';

interface BulkActionsProps {
  selectedTasks: string[];
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  isSelectMode: boolean;
  onToggleSelectMode: () => void;
}

export function BulkActions({ 
  selectedTasks, 
  tasks, 
  onToggleTask, 
  onDeleteTask, 
  onSelectAll, 
  onDeselectAll,
  isSelectMode,
  onToggleSelectMode
}: BulkActionsProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedTaskObjects = tasks.filter(task => selectedTasks.includes(task.id));
  const selectedCount = selectedTasks.length;
  const allSelected = tasks.length > 0 && selectedTasks.length === tasks.length;
  const someSelected = selectedTasks.length > 0 && !allSelected;

  const handleBulkComplete = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    
    const incompleteTasks = selectedTaskObjects.filter(task => !task.completed);
    
    try {
      for (const task of incompleteTasks) {
        onToggleTask(task.id);
      }
      toast.success(`Marked ${incompleteTasks.length} task(s) as complete`);
      onDeselectAll();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkIncomplete = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    
    const completeTasks = selectedTaskObjects.filter(task => task.completed);
    
    try {
      for (const task of completeTasks) {
        onToggleTask(task.id);
      }
      toast.success(`Marked ${completeTasks.length} task(s) as incomplete`);
      onDeselectAll();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkDelete = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    
    try {
      for (const taskId of selectedTasks) {
        onDeleteTask(taskId);
      }
      toast.success(`Deleted ${selectedCount} task(s)`);
      onDeselectAll();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleSelectAll = () => {
    if (allSelected || someSelected) {
      onDeselectAll();
    } else {
      onSelectAll();
    }
  };

  if (!isSelectMode && selectedCount === 0) {
    return (
      <div className="flex items-center justify-between">
        <div></div>
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleSelectMode}
          className="gap-2"
        >
          <Square size={14} />
          Select Tasks
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between bg-card border rounded-lg p-3 mb-4">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggleSelectAll}
          className="gap-2"
        >
          {allSelected ? <CheckSquare size={16} /> : <Square size={16} />}
          {allSelected ? 'Deselect All' : 'Select All'}
        </Button>
        
        {selectedCount > 0 && (
          <Badge variant="secondary">
            {selectedCount} task{selectedCount !== 1 ? 's' : ''} selected
          </Badge>
        )}
      </div>

      {selectedCount > 0 && (
        <div className="flex items-center gap-2">
          {/* Complete selected incomplete tasks */}
          {selectedTaskObjects.some(task => !task.completed) && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkComplete}
              disabled={isProcessing}
              className="gap-2"
            >
              <CheckCircle size={14} />
              Complete
            </Button>
          )}

          {/* Incomplete selected complete tasks */}
          {selectedTaskObjects.some(task => task.completed) && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkIncomplete}
              disabled={isProcessing}
              className="gap-2"
            >
              <XCircle size={14} />
              Reopen
            </Button>
          )}

          {/* Delete selected tasks */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleBulkDelete}
            disabled={isProcessing}
            className="gap-2 text-destructive hover:text-destructive"
          >
            <Trash size={14} />
            Delete
          </Button>

          {/* Cancel selection */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onDeselectAll();
              onToggleSelectMode();
            }}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}