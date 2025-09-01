import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Keyboard } from '@phosphor-icons/react';
import { formatShortcutKey } from '@/hooks/useKeyboardShortcuts';

interface KeyboardShortcutsHelpProps {
  shortcuts: Array<{
    key: string;
    ctrlKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
    description: string;
    disabled?: boolean;
  }>;
}

export const KeyboardShortcutsHelp = ({ shortcuts }: KeyboardShortcutsHelpProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const activeShortcuts = shortcuts.filter(s => !s.disabled);

  const shortcutGroups = {
    'Task Management': activeShortcuts.filter(s => 
      s.description.toLowerCase().includes('task') || 
      s.description.toLowerCase().includes('add') ||
      s.description.toLowerCase().includes('complete')
    ),
    'Navigation': activeShortcuts.filter(s => 
      s.description.toLowerCase().includes('search') ||
      s.description.toLowerCase().includes('focus') ||
      s.description.toLowerCase().includes('template')
    ),
    'Selection': activeShortcuts.filter(s => 
      s.description.toLowerCase().includes('select') ||
      s.description.toLowerCase().includes('bulk')
    ),
    'Other': activeShortcuts.filter(s => {
      const desc = s.description.toLowerCase();
      return !desc.includes('task') && 
             !desc.includes('add') && 
             !desc.includes('complete') &&
             !desc.includes('search') && 
             !desc.includes('focus') && 
             !desc.includes('template') &&
             !desc.includes('select') && 
             !desc.includes('bulk');
    })
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Keyboard className="w-4 h-4" />
          Shortcuts
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="w-5 h-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Use these shortcuts to navigate and manage tasks quickly
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6">
          {Object.entries(shortcutGroups).map(([groupName, groupShortcuts]) => {
            if (groupShortcuts.length === 0) return null;

            return (
              <div key={groupName} className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  {groupName}
                </h3>
                <div className="grid gap-2">
                  {groupShortcuts.map((shortcut, index) => (
                    <Card key={index} className="border-muted">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{shortcut.description}</span>
                          <Badge variant="outline" className="font-mono text-xs">
                            {formatShortcutKey(shortcut)}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            Shortcuts work when not focused on input fields
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};