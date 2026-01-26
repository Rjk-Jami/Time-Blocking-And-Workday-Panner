'use client';

import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Field } from './Field';

type TextFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
  required?: boolean;
  type?: string;
};
export const TextField = ({ name, label, required, type, ...rest }: TextFieldProps) => {
  const form = useFormContext();

  return (
    <Field name={name} label={label} required={required}>
      <Input {...form.register(name)} {...rest} type={type} />
    </Field>
  );
};
