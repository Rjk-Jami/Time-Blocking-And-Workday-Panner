"use client";

import { useFormContext } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

interface SwitchFieldProps {
  name: string;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export const SwitchField = ({
  name,
  label,
  description,
  disabled = false,
  className = "",
}: SwitchFieldProps) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={`flex flex-row items-center justify-between rounded-lg border p-4 ${className}`}
        >
          <div className='space-y-0.5'>
            {label && (
              <Label htmlFor={name} className='text-base font-medium'>
                {label}
              </Label>
            )}
            {description && (
              <div className='text-sm text-muted-foreground'>{description}</div>
            )}
          </div>
          <FormControl>
            <Switch
              id={name}
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
