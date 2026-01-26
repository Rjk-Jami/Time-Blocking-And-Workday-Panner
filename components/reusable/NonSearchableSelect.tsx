import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export interface SelectOption {
  value: string;
  label: string;
}

interface NonSearchableSelectProps {
  options: SelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  alignOffset?: number;
  onSelect?: (selected: { value: string; label: string } | null) => void;
}

export function NonSearchableSelect({
  options,
  value,
  disabled,
  className,
  onValueChange,
  placeholder = 'Select option...',
  alignOffset = 0,
  onSelect,
}: NonSearchableSelectProps) {
  const [open, setOpen] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [buttonWidth, setButtonWidth] = React.useState<number>(200);

  React.useEffect(() => {
    if (buttonRef.current) {
      setButtonWidth(buttonRef.current.offsetWidth);
    }
  }, [buttonRef]);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={buttonRef}
          disabled={disabled}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-full justify-between px-4 bg-background border-border/60 font-normal text-sm',
            'hover:border-border hover:bg-muted/30',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary',
            'transition-all duration-200',
            !value && 'text-muted-foreground',
            open && 'ring-2 ring-primary/20 border-primary bg-muted/30',
            className
          )}
        >
          <span className="truncate text-left font-normal">
            {selectedOption ? selectedOption.label : placeholder}
          </span>

          <ChevronsUpDown
            className={cn(
              'ml-2 h-4 w-4 shrink-0 text-muted-foreground/60 transition-transform duration-200',
              open && 'rotate-180'
            )}
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        style={{ width: buttonWidth }}
        className="p-0 shadow-xl border-border/80 bg-popover/95 backdrop-blur-sm left-2"
        align="start"
        sideOffset={8}
        alignOffset={alignOffset}
      >
        <Command className="rounded-lg border-0">
          <CommandList className="max-h-[300px] overflow-y-auto modal-scroll p-2">
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    const newValue = value === option.value ? '' : option.value;
                    onSelect?.(newValue ? option : null);
                    onValueChange?.(newValue);
                    setOpen(false);
                  }}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg cursor-pointer transition-all duration-150 hover:bg-accent/50',
                    value === option.value && 'bg-primary/8 hover:bg-primary/12'
                  )}
                >
                  <div
                    className={cn(
                      'flex h-4 w-4 items-center justify-center rounded-sm border transition-all',
                      value === option.value
                        ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
                        : 'border-border/50'
                    )}
                  >
                    <Check
                      className={cn(
                        'h-3.5 w-3.5 transition-all text-white',
                        value === option.value ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                      )}
                    />
                  </div>

                  <span
                    className={cn(
                      'flex-1 transition-all',
                      value === option.value ? 'font-medium text-foreground' : 'text-foreground/80'
                    )}
                  >
                    {option.label}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
