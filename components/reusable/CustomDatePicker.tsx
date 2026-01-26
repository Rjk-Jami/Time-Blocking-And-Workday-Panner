'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format, parse } from 'date-fns';
import { cn } from '@/lib/utils';
import { CustomCalendar } from './CustomCalendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DatePickerProps {
  value?: Date | string;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function CustomDatePicker({
  value,
  onChange,
  placeholder = 'Pick a date',
  className,
  disabled = false,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);

  // Convert string value to Date if needed
  const parsedDate: Date | undefined = (() => {
    if (typeof value === 'string') {
      const parsed = parse(value, 'yyyy-MM-dd', new Date());
      return isNaN(parsed.getTime()) ? undefined : parsed;
    }
    return value;
  })();

  const handleDateChange = (date: Date) => {
    onChange(date);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full pl-3 text-left font-normal',
            !parsedDate && 'text-muted-foreground',
            className
          )}
          disabled={disabled}
        >
          {parsedDate ? format(parsedDate, 'PPP') : placeholder}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <CustomCalendar value={parsedDate} onChange={handleDateChange} />
      </PopoverContent>
    </Popover>
  );
}
