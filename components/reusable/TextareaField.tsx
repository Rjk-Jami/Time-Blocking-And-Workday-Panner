'use client';

import { useFormContext } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { Field } from './Field';

type TextareaFieldProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  name: string;
  label: string;
  required?: boolean;
};

export const TextareaField = ({ name, label, required, ...rest }: TextareaFieldProps) => {
  const form = useFormContext();

  return (
    <Field name={name} label={label} required={required}>
      <Textarea {...form.register(name)} {...rest} />
    </Field>
  );
};
