import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Moon, Sun, Monitor } from '@phosphor-icons/react';
import { useTheme } from '@/contexts/ThemeContext';
import { useI18n } from '@/contexts/I18nContext';

export function ThemeToggle() {
  const { theme, setTheme, actualTheme } = useTheme();
  const { t } = useI18n();

  const getThemeIcon = () => {
    if (theme === 'system') {
      return <Monitor size={16} />;
    }
    return actualTheme === 'dark' ? <Moon size={16} /> : <Sun size={16} />;
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return t('theme.light');
      case 'dark':
        return t('theme.dark');
      case 'system':
        return t('theme.system');
      default:
        return t('theme.system');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 h-8"
          aria-label={t('theme.toggleTheme')}
        >
          {getThemeIcon()}
          <span className="hidden sm:inline">{getThemeLabel()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-32">
        <DropdownMenuItem
          onClick={() => setTheme('light')}
          className="gap-2 cursor-pointer"
        >
          <Sun size={16} />
          {t('theme.light')}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          className="gap-2 cursor-pointer"
        >
          <Moon size={16} />
          {t('theme.dark')}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('system')}
          className="gap-2 cursor-pointer"
        >
          <Monitor size={16} />
          {t('theme.system')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}