'use client';

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

interface FieldProps {
  name: string;
  label?: string;
  children: React.ReactNode;
  required?: boolean;
}

export const Field = ({ name, label, children, required }: FieldProps) => {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className="gap-1 h-fit">
          {label && (
            <FormLabel className="text-xs font-semibold">
              {label} {required && <span className="text-red-500">*</span>}
            </FormLabel>
          )}
          <FormControl className="block">{children}</FormControl>
          <FormMessage className="text-xs text-red-500" />
        </FormItem>
      )}
    />
  );
};
