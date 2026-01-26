'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { Field } from './Field';
import { SearchableSelect } from './SearchableDropdown';

type SearchableSelectFieldProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  name: string;
  label: string;
  required?: boolean;
  options: { value: string; label: string }[];
  disabled?: boolean;
  className?: string;
};

export const SearchableSelectField = ({
  name,
  label,
  required,
  options = [],
  disabled = false,
  className,
}: SearchableSelectFieldProps) => {
  const form = useFormContext();

  return (
    <Field name={name} label={label} required={required}>
      <Controller
        control={form.control}
        name={name}
        render={({ field }) => (
          <SearchableSelect
            className={className}
            options={options}
            value={field.value}
            onValueChange={field.onChange}
            placeholder={`Select ${label}`}
            disabled={disabled}
          />
        )}
      />
    </Field>
  );
};
