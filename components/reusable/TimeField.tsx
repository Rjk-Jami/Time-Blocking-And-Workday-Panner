"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Field } from "./Field"; // <-- adjust import if Field is elsewhere

type TimeFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
};

export const TimeField = ({
  name,
  label,
  required,
  disabled,
  ...rest
}: TimeFieldProps) => {
  const form = useFormContext();

  return (
    <Field name={name} label={label} required={required}>
      <Controller
        control={form.control}
        name={name}
        render={({ field }) => (
          <Input
            type="time"
            value={field.value || ""}
            onChange={field.onChange}
            disabled={disabled}
            {...rest}
          />
        )}
      />
    </Field>
  );
};
