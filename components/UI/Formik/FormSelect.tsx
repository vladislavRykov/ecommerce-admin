import ThreeDots from '@/components/Loaders/ThreeDots';
import { Field, FieldAttributes, useField } from 'formik';
import React from 'react';

interface FormSelectProps {
  label?: string;
  isLoading?: boolean;
}
const FormSelect: React.FC<FormSelectProps & FieldAttributes<any>> = ({
  label,
  isLoading = false,
  children,
  className,
  ...props
}) => {
  const fieldStyle =
    'leading-6 resize-none w-full border-2 border-solid border-gray-300 p-2 rounded-xl transition-colors duration-300 focus:border-blue-900';
  const [field, meta, helpers] = useField(props);
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label className="ml-1 text-lg">{label}</label>}
      <div className="relative">
        <Field {...field} {...props} as="select" className={fieldStyle}>
          {children}
        </Field>
        {isLoading && (
          <ThreeDots className="absolute top-1/2 -translate-y-1/2 left-3" alt="loading..." />
        )}
      </div>
      {meta.touched && meta.error && <div className="text-orange-700">{meta.error}</div>}
    </div>
  );
};

export default FormSelect;
