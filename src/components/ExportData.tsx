import { useState } from 'react';
import { Task, Category, formatDate } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Download, FileText, Table } from '@phosphor-icons/react';
import { toast } from 'sonner';

interface ExportDataProps {
  tasks: Task[];
  categories: Category[];
}

type ExportFormat = 'csv' | 'json' | 'txt';

export function ExportData({ tasks, categories }: ExportDataProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [format, setFormat] = useState<ExportFormat>('csv');

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || categoryId;
  };

  const exportAsCSV = () => {
    const headers = ['Title', 'Category', 'Priority', 'Status', 'Created', 'Due Date', 'Completed Date', 'Description'];
    const csvData = tasks.map(task => [
      `"${task.title.replace(/"/g, '""')}"`,
      getCategoryName(task.category),
      task.priority,
      task.completed ? 'Completed' : 'Pending',
      formatDate(task.createdAt),
      task.dueDate ? formatDate(task.dueDate) : '',
      task.completedAt ? formatDate(task.completedAt) : '',
      `"${(task.description || '').replace(/"/g, '""')}"`
    ]);

    const csv = [headers.join(','), ...csvData.map(row => row.join(','))].join('\n');
    downloadFile(csv, 'tasks.csv', 'text/csv');
  };

  const exportAsJSON = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.completed).length,
      categories: categories,
      tasks: tasks.map(task => ({
        ...task,
        categoryName: getCategoryName(task.category),
        createdAtFormatted: formatDate(task.createdAt),
        dueDateFormatted: task.dueDate ? formatDate(task.dueDate) : null,
        completedAtFormatted: task.completedAt ? formatDate(task.completedAt) : null
      }))
    };

    const json = JSON.stringify(exportData, null, 2);
    downloadFile(json, 'tasks.json', 'application/json');
  };

  const exportAsText = () => {
    let text = `TaskFlow Export - ${new Date().toLocaleDateString()}\n`;
    text += `Total Tasks: ${tasks.length}\n`;
    text += `Completed: ${tasks.filter(t => t.completed).length}\n`;
    text += `Pending: ${tasks.filter(t => !t.completed).length}\n\n`;

    // Group by category
    const tasksByCategory = tasks.reduce((acc, task) => {
      const categoryName = getCategoryName(task.category);
      if (!acc[categoryName]) acc[categoryName] = [];
      acc[categoryName].push(task);
      return acc;
    }, {} as Record<string, Task[]>);

    Object.entries(tasksByCategory).forEach(([categoryName, categoryTasks]) => {
      text += `${categoryName.toUpperCase()}\n`;
      text += '='.repeat(categoryName.length) + '\n\n';

      // Separate pending and completed
      const pending = categoryTasks.filter(t => !t.completed);
      const completed = categoryTasks.filter(t => t.completed);

      if (pending.length > 0) {
        text += 'Pending Tasks:\n';
        pending.forEach(task => {
          text += `• ${task.title}`;
          text += ` [${task.priority.toUpperCase()}]`;
          if (task.dueDate) text += ` (Due: ${formatDate(task.dueDate)})`;
          if (task.description) text += `\n  ${task.description}`;
          text += '\n';
        });
        text += '\n';
      }

      if (completed.length > 0) {
        text += 'Completed Tasks:\n';
        completed.forEach(task => {
          text += `✓ ${task.title}`;
          if (task.completedAt) text += ` (Completed: ${formatDate(task.completedAt)})`;
          text += '\n';
        });
        text += '\n';
      }
    });

    downloadFile(text, 'tasks.txt', 'text/plain');
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    try {
      switch (format) {
        case 'csv':
          exportAsCSV();
          toast.success('Tasks exported as CSV');
          break;
        case 'json':
          exportAsJSON();
          toast.success('Tasks exported as JSON');
          break;
        case 'txt':
          exportAsText();
          toast.success('Tasks exported as text');
          break;
      }
      setIsOpen(false);
    } catch (error) {
      toast.error('Failed to export tasks');
    }
  };

  if (tasks.length === 0) return null;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Download size={14} />
          Export
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Export Tasks</h4>
            <p className="text-sm text-muted-foreground">
              Download your task data in your preferred format
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Export Format</label>
            <Select value={format} onValueChange={(value: ExportFormat) => setFormat(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">
                  <div className="flex items-center gap-2">
                    <Table size={14} />
                    CSV (Spreadsheet)
                  </div>
                </SelectItem>
                <SelectItem value="json">
                  <div className="flex items-center gap-2">
                    <FileText size={14} />
                    JSON (Developer)
                  </div>
                </SelectItem>
                <SelectItem value="txt">
                  <div className="flex items-center gap-2">
                    <FileText size={14} />
                    Text (Readable)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Will export {tasks.length} task{tasks.length !== 1 ? 's' : ''}</p>
            <p>Including categories, priorities, and dates</p>
          </div>

          <Button onClick={handleExport} className="w-full gap-2">
            <Download size={14} />
            Export {format.toUpperCase()}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}