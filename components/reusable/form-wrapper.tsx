'use client';

import { FormProvider, UseFormReturn } from 'react-hook-form';
import { cn } from '@/lib/utils';

interface FormWrapperProps {
  form: UseFormReturn<any>;
  onSubmit: (values: any) => void | Promise<void>;
  className?: string;
  children: React.ReactNode;
}

export const FormWrapper = ({ form, onSubmit, className, children }: FormWrapperProps) => {
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn('', className)}>
        {children}
      </form>
    </FormProvider>
  );
};
