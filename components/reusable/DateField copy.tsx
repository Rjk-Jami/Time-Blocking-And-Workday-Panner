'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { Field } from './Field';
import { CustomDatePicker } from '@/components/reusable/CustomDatePicker';

type DateFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
};

export const DateField = ({ name, label, required, disabled }: DateFieldProps) => {
  const form = useFormContext();

  return (
    <Field name={name} label={label} required={required}>
      <Controller
        control={form.control}
        name={name}
        render={({ field }) => (
          <CustomDatePicker
            value={field.value}
            onChange={(date) => field.onChange(date)}
            disabled={disabled} // pass disabled to date picker
          />
        )}
      />
    </Field>
  );
};
