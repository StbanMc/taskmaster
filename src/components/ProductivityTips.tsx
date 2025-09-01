import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X, Lightbulb, FileText, Headphones } from '@phosphor-icons/react';
import { useI18n } from '@/contexts/I18nContext';

interface TipData {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  category: 'productivity' | 'features' | 'shortcuts';
}

const PRODUCTIVITY_TIPS: TipData[] = [
  {
    id: 'keyboard-shortcuts',
    icon: <Lightbulb className="w-5 h-5" />,
    title: 'Master Keyboard Shortcuts',
    description: 'Use Ctrl+N to quickly add tasks, / to search, and Ctrl+A to select all tasks. Press ? to see all shortcuts.',
    category: 'shortcuts'
  },
  {
    id: 'templates',
    icon: <FileText className="w-5 h-5" />,
    title: 'Save Time with Templates',
    description: 'Create templates for recurring tasks like daily standups, workout routines, or weekly reviews.',
    category: 'features'
  },
  {
    id: 'priorities',
    icon: <Headphones className="w-5 h-5" />,
    title: 'Prioritize Effectively',
    description: 'Use High priority for urgent tasks, Medium for important ones, and Low for tasks you can do later.',
    category: 'productivity'
  }
];

interface ProductivityTipsProps {
  tasks: any[];
}

export function ProductivityTips({ tasks }: ProductivityTipsProps) {
  const { t } = useI18n();
  const [showTips, setShowTips] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [dismissedTips, setDismissedTips] = useState<string[]>([]);

  // Show tips for new users or when they reach certain milestones
  useEffect(() => {
    if (tasks.length === 0 || tasks.length === 5 || tasks.length === 25) {
      const hasSeenTip = localStorage.getItem(`tip-shown-${tasks.length}`);
      if (!hasSeenTip) {
        setShowTips(true);
        localStorage.setItem(`tip-shown-${tasks.length}`, 'true');
      }
    }
  }, [tasks.length]);

  const activeTips = PRODUCTIVITY_TIPS.filter(tip => !dismissedTips.includes(tip.id));
  const currentTip = activeTips[currentTipIndex];

  const handleNextTip = () => {
    if (currentTipIndex < activeTips.length - 1) {
      setCurrentTipIndex(prev => prev + 1);
    } else {
      setShowTips(false);
    }
  };

  const handleDismissTip = () => {
    if (currentTip) {
      setDismissedTips(prev => [...prev, currentTip.id]);
      localStorage.setItem('dismissed-tips', JSON.stringify([...dismissedTips, currentTip.id]));
    }
    handleNextTip();
  };

  if (!showTips || !currentTip) return null;

  return (
    <Dialog open={showTips} onOpenChange={setShowTips}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {currentTip.icon}
            {currentTip.title}
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTips(false)}
            className="absolute right-4 top-4"
          >
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {currentTip.description}
          </p>
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              {currentTipIndex + 1} of {activeTips.length}
            </span>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleDismissTip}>
                Got it
              </Button>
              <Button size="sm" onClick={handleNextTip}>
                {currentTipIndex < activeTips.length - 1 ? 'Next' : 'Finish'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}