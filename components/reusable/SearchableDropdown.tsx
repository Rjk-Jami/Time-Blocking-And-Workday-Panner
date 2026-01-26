import * as React from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export interface SearchableSelectOption {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: SearchableSelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
  className?: string;
  disabled?: boolean;
  alignOffset?: number;
  onSelect?: (selected: { value: string; label: string }) => void;
}

function useDebouncedValue<T>(value: T, delay = 150): T {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export function SearchableSelect({
  onSelect,
  options,
  value,
  disabled,
  onValueChange,
  placeholder = 'Select option...',
  emptyText = 'No option found.',
  className,
  alignOffset = 0,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const debouncedSearch = useDebouncedValue(search, 150);

  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [buttonWidth, setButtonWidth] = React.useState<number>();

  React.useEffect(() => {
    if (open && buttonRef.current) {
      setButtonWidth(buttonRef.current.offsetWidth);
    }
  }, [open]);

  const filteredOptions = React.useMemo(() => {
    if (!debouncedSearch) return options;
    const searchLower = debouncedSearch.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(searchLower));
  }, [options, debouncedSearch]);

  const displayedOptions = React.useMemo(() => {
    const selected = options.find((opt) => opt.value === value);
    const limited = filteredOptions.slice(0, 500);

    if (selected && limited.some((opt) => opt.value === selected.value)) {
      return [selected, ...limited.filter((opt) => opt.value !== selected.value)];
    }
    return limited;
  }, [filteredOptions, value, options]);

  const selectedOption = React.useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value]
  );

  const handleSelect = (option: SearchableSelectOption) => {
    onSelect?.(option);
    onValueChange?.(option.value === value ? '' : option.value);
    setOpen(false);
    setSearch('');
  };

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
            'w-full min-w-0 overflow-hidden',
            'flex items-center justify-between gap-2 px-4',
            'bg-background border-border/60 font-normal text-sm',
            'hover:border-border hover:bg-muted/30',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary',
            'transition-all duration-200',
            !value && 'text-muted-foreground',
            open && 'ring-2 ring-primary/20 border-primary bg-muted/30',
            className
          )}
        >
          <span className="block w-full truncate text-left font-normal">
            {selectedOption ? selectedOption.label : placeholder}
          </span>

          <ChevronsUpDown
            className={cn(
              'h-4 w-4 shrink-0 text-muted-foreground/60 transition-transform duration-200',
              open && 'rotate-180'
            )}
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        style={{ width: buttonWidth }}
        className="p-0 shadow-xl border-border/80 bg-popover/95 backdrop-blur-sm"
        align="start"
        sideOffset={8}
        alignOffset={alignOffset}
      >
        <Command className="rounded-lg border-0" shouldFilter={false}>
          <div className="flex items-center border-b border-border/50 px-3">
            <CommandInput
              placeholder="Search..."
              value={search}
              onValueChange={setSearch}
              className="h-11 border-0 bg-transparent focus:ring-0 text-sm"
            />
          </div>

          <CommandList className="max-h-[300px] overflow-y-auto p-2">
            {filteredOptions.length === 0 && (
              <CommandEmpty className="py-10 text-center text-sm text-muted-foreground">
                <div className="flex flex-col items-center gap-2">
                  <Search className="h-8 w-8 opacity-10" />
                  <p className="font-medium">{emptyText}</p>
                </div>
              </CommandEmpty>
            )}

            {filteredOptions.length > 0 && (
              <CommandGroup>
                {displayedOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    keywords={[option.label]}
                    onSelect={() => handleSelect(option)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg cursor-pointer',
                      'transition-all hover:bg-accent/50',
                      value === option.value && 'bg-primary/8'
                    )}
                  >
                    <div
                      className={cn(
                        'flex h-4 w-4 items-center justify-center rounded-sm border shrink-0',
                        value === option.value
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'border-border/50'
                      )}
                    >
                      <Check
                        className={cn(
                          'h-3.5 w-3.5',
                          value === option.value ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                    </div>

                    <span className="flex-1 ">{option.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
