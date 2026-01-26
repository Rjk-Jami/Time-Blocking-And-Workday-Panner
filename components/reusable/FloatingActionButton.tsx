'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  ariaLabel?: string;
}

const sizeClasses = {
  sm: 'h-12 w-12',
  md: 'h-14 w-14',
  lg: 'h-16 w-16',
};

export function FloatingActionButton({
  onClick,
  className,
  size = 'md',
  ariaLabel = 'Floating Action Button',
}: FloatingActionButtonProps) {
  return (
    <div className="fixed z-999 bottom-6 right-6">
      <Button
        size="icon"
        aria-label={ariaLabel}
        onClick={onClick}
        className={cn(
          'rounded-full shadow-lg bg-slate-900 hover:bg-slate-800 transition-transform hover:scale-105 active:scale-95',
          sizeClasses[size],
          className
        )}
      >
        <Plus className="h-7 w-7 text-white" />
      </Button>
    </div>
  );
}
